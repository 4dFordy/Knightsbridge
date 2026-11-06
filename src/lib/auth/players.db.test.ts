// @vitest-environment node
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createDb, type Db } from "@/lib/db";
import {
  authenticate,
  createSession,
  endSession,
  LOCKOUT_ATTEMPTS,
  playerForSession,
  registerPlayer,
  SESSION_IDLE_MS,
  SESSION_MAX_AGE_MS,
} from "./players";

const url = process.env.TEST_DATABASE_URL;
const adult = { year: 1990, month: 5, day: 17 };
const newEmail = () => `Test.${randomUUID()}@Example.com`;

describe.skipIf(!url)("player accounts (real database)", () => {
  let db: Db;
  beforeAll(() => {
    db = createDb(url!);
  });
  afterAll(() => db.$disconnect());

  const register = (email = newEmail(), dateOfBirth = adult) =>
    registerPlayer(db, { firstName: "Sam", lastName: "Jones", email, password: "correct horse battery", dateOfBirth });

  it("creates an account with a lower-case email and a hashed password", async () => {
    const email = newEmail();
    const r = await register(email);
    expect(r.ok).toBe(true);
    const p = await db.player.findUniqueOrThrow({ where: { email: email.toLowerCase() } });
    expect(p.passwordHash).toMatch(/^\$argon2id\$/);
  });

  it("refuses a second account for the same email, whatever the capitals", async () => {
    const email = newEmail();
    await register(email);
    expect(await register(email.toUpperCase())).toEqual({ ok: false, reason: "email_taken" });
  });

  it("refuses under-18s in the app and in the database", async () => {
    const now = new Date();
    const kid = { year: now.getFullYear() - 17, month: 1, day: 1 };
    expect(await register(newEmail(), kid)).toEqual({ ok: false, reason: "under_18" });
    await expect(
      db.player.create({
        data: {
          email: newEmail().toLowerCase(),
          passwordHash: "x",
          firstName: "A",
          lastName: "B",
          dateOfBirth: new Date(Date.UTC(kid.year, 0, 1)),
        },
      }),
    ).rejects.toThrow(/18 or over/);
  });

  it("signs in with the right password and gives the same answer for a wrong password or unknown email", async () => {
    const email = newEmail();
    await register(email);
    expect(await authenticate(db, email, "correct horse battery")).toMatchObject({ ok: true });
    expect(await authenticate(db, email, "wrong password!!")).toEqual({ ok: false, reason: "invalid" });
    expect(await authenticate(db, newEmail(), "correct horse battery")).toEqual({ ok: false, reason: "invalid" });
  });

  it("pauses sign-in for an email after 5 wrong passwords in 15 minutes", async () => {
    const email = newEmail();
    await register(email);
    for (let i = 0; i < LOCKOUT_ATTEMPTS; i++) await authenticate(db, email, `wrong-${i}-password`);
    expect(await authenticate(db, email, "correct horse battery")).toEqual({ ok: false, reason: "locked" });
    // 16 minutes later it works again.
    const later = new Date(Date.now() + 16 * 60_000);
    expect(await authenticate(db, email, "correct horse battery", later)).toMatchObject({ ok: true });
  });

  it("keeps sessions as a hash, and ends them on sign-out, expiry or 7 days idle", async () => {
    const r = await register();
    if (!r.ok) throw new Error("setup");
    const now = new Date();
    const { token } = await createSession(db, r.playerId, now);
    expect(await db.playerSession.findUnique({ where: { id: token } })).toBeNull(); // token itself isn't stored
    expect((await playerForSession(db, token, now))?.id).toBe(r.playerId);
    expect(await playerForSession(db, "made-up-token", now)).toBeNull();
    expect(await playerForSession(db, token, new Date(now.getTime() + SESSION_IDLE_MS + 1000))).toBeNull();
    expect(await playerForSession(db, token, new Date(now.getTime() + SESSION_MAX_AGE_MS + 1000))).toBeNull();
    await endSession(db, token, now);
    expect(await playerForSession(db, token, now)).toBeNull();
  });

  it("records sign-up, sign-in and sign-out in the audit log without personal details", async () => {
    const email = newEmail();
    const r = await register(email);
    if (!r.ok) throw new Error("setup");
    const { token } = await createSession(db, r.playerId);
    await endSession(db, token);
    const entries = await db.auditLog.findMany({ where: { entityType: "player", entityId: r.playerId }, orderBy: { id: "asc" } });
    expect(entries.map((e) => e.action)).toEqual(["player.signed_up", "player.signed_in", "player.signed_out"]);
    const text = JSON.stringify(entries, (_k, v) => (typeof v === "bigint" ? String(v) : v));
    expect(text).not.toContain(email.toLowerCase());
    expect(text).not.toContain("Sam");
  });
});
