import "server-only";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { playerForSession, type SessionPlayer } from "./players";

/** "__Host-" means the browser only sends it over HTTPS, to this exact site, for every path. */
export const SESSION_COOKIE = "__Host-innit_session";
/** Not secret: only tells the header to show "Account" instead of "Sign in". Never trusted for access. */
export const SIGNED_IN_HINT_COOKIE = "innit_signed_in";

export async function setSessionCookie(token: string, expiresAt: Date) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true, // not readable by page scripts
    secure: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  (await cookies()).set(SIGNED_IN_HINT_COOKIE, "1", { secure: true, sameSite: "lax", path: "/", expires: expiresAt });
}

export async function readSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
  (await cookies()).delete(SIGNED_IN_HINT_COOKIE);
}

/** The signed-in player for this request, or null. */
export async function currentPlayer(): Promise<SessionPlayer | null> {
  const db = getDb();
  if (!db) return null;
  return playerForSession(db, await readSessionToken());
}
