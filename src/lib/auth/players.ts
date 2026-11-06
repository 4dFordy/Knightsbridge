import { createHash, randomBytes } from "node:crypto";
import { recordAudit } from "@/lib/audit";
import type { Db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { isAdult, toDateOnly, type CalendarDate } from "@/lib/age";
import { hashPassword, verifyAgainstDummy, verifyPassword } from "./password";
import { normaliseEmail } from "./validation";

/** Sessions last 30 days at most, and end after 7 days without use. */
export const SESSION_MAX_AGE_MS = 30 * 24 * 3600_000;
export const SESSION_IDLE_MS = 7 * 24 * 3600_000;
/** After 5 wrong passwords for one email within 15 minutes, sign-in is paused for that email. */
export const LOCKOUT_ATTEMPTS = 5;
export const LOCKOUT_WINDOW_MS = 15 * 60_000;

export type NewPlayer = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: CalendarDate;
};

export type RegisterResult = { ok: true; playerId: string } | { ok: false; reason: "email_taken" | "under_18" };

/** Creates a player account. Audit entries use the player id only, never personal details. */
export async function registerPlayer(db: Db, input: NewPlayer, now: Date = new Date()): Promise<RegisterResult> {
  if (!isAdult(input.dateOfBirth, now)) return { ok: false, reason: "under_18" };
  const passwordHash = await hashPassword(input.password);
  try {
    const player = await db.$transaction(async (tx) => {
      const p = await tx.player.create({
        data: {
          email: normaliseEmail(input.email),
          passwordHash,
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          dateOfBirth: toDateOnly(input.dateOfBirth),
        },
        select: { id: true },
      });
      await recordAudit(tx, { actorType: "PLAYER", actorId: p.id, action: "player.signed_up", entityType: "player", entityId: p.id });
      return p;
    });
    return { ok: true, playerId: player.id };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return { ok: false, reason: "email_taken" };
    throw e;
  }
}

export type SignInResult = { ok: true; playerId: string } | { ok: false; reason: "invalid" | "locked" };

/** Checks an email and password. Wrong email and wrong password look identical to the user. */
export async function authenticate(db: Db, rawEmail: string, password: string, now: Date = new Date()): Promise<SignInResult> {
  const email = normaliseEmail(rawEmail);
  const recentFailures = await db.signInAttempt.count({
    where: { email, succeeded: false, createdAt: { gt: new Date(now.getTime() - LOCKOUT_WINDOW_MS) } },
  });
  if (recentFailures >= LOCKOUT_ATTEMPTS) return { ok: false, reason: "locked" };

  const player = await db.player.findUnique({ where: { email }, select: { id: true, passwordHash: true } });
  const ok = player ? await verifyPassword(player.passwordHash, password) : await verifyAgainstDummy(password);

  await db.signInAttempt.create({ data: { email, succeeded: ok, createdAt: now } });
  if (!ok || !player) return { ok: false, reason: "invalid" };
  return { ok: true, playerId: player.id };
}

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

/** Starts a session. Returns the token for the cookie; the database keeps only its hash. */
export async function createSession(db: Db, playerId: string, now: Date = new Date()): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(now.getTime() + SESSION_MAX_AGE_MS);
  await db.$transaction(async (tx) => {
    await tx.playerSession.create({
      data: { id: sha256(token), playerId, createdAt: now, lastSeenAt: now, expiresAt },
    });
    await recordAudit(tx, { actorType: "PLAYER", actorId: playerId, action: "player.signed_in", entityType: "player", entityId: playerId });
  });
  return { token, expiresAt };
}

export type SessionPlayer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  ageVerifiedAt: Date | null;
};

/** The player for a session token, or null if it's unknown, expired, idle too long or signed out. */
export async function playerForSession(db: Db, token: string | undefined, now: Date = new Date()): Promise<SessionPlayer | null> {
  if (!token) return null;
  const session = await db.playerSession.findUnique({
    where: { id: sha256(token) },
    include: { player: { select: { id: true, firstName: true, lastName: true, email: true, ageVerifiedAt: true } } },
  });
  if (!session || session.revokedAt) return null;
  if (session.expiresAt <= now) return null;
  if (now.getTime() - session.lastSeenAt.getTime() > SESSION_IDLE_MS) return null;
  // Record activity at most once an hour, to keep reads cheap.
  if (now.getTime() - session.lastSeenAt.getTime() > 3600_000) {
    await db.playerSession.update({ where: { id: session.id }, data: { lastSeenAt: now } });
  }
  return session.player;
}

export async function endSession(db: Db, token: string | undefined, now: Date = new Date()): Promise<void> {
  if (!token) return;
  const id = sha256(token);
  const session = await db.playerSession.findUnique({ where: { id }, select: { playerId: true, revokedAt: true } });
  if (!session || session.revokedAt) return;
  await db.$transaction(async (tx) => {
    await tx.playerSession.update({ where: { id }, data: { revokedAt: now } });
    await recordAudit(tx, {
      actorType: "PLAYER",
      actorId: session.playerId,
      action: "player.signed_out",
      entityType: "player",
      entityId: session.playerId,
    });
  });
}
