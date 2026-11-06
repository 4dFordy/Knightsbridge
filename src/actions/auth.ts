"use server";

import { redirect } from "next/navigation";
import { authenticate, createSession, endSession, registerPlayer } from "@/lib/auth/players";
import { clearSessionCookie, readSessionToken, setSessionCookie } from "@/lib/auth/session";
import { dateOfBirthFromForm, fieldErrors, signInSchema, signUpSchema, type FieldErrors } from "@/lib/auth/validation";
import { getDb } from "@/lib/db";

export type FormState = { errors?: FieldErrors; values?: Record<string, string> };

const NO_DATABASE: FormState = { errors: { form: "Accounts aren't available on this version of the site yet." } };

/** Form values to send back after an error, so the player doesn't retype them. Never the password. */
function keep(form: FormData, keys: string[]): Record<string, string> {
  return Object.fromEntries(keys.map((k) => [k, String(form.get(k) ?? "")]));
}

export async function signUp(_prev: FormState, form: FormData): Promise<FormState> {
  const values = keep(form, ["firstName", "lastName", "email", "dobDay", "dobMonth", "dobYear"]);
  const dateOfBirth = dateOfBirthFromForm(form.get("dobDay"), form.get("dobMonth"), form.get("dobYear"));
  const parsed = signUpSchema().safeParse({ ...Object.fromEntries(form), dateOfBirth });
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  const db = getDb();
  if (!db) return NO_DATABASE;
  const result = await registerPlayer(db, parsed.data);
  if (!result.ok) {
    return result.reason === "email_taken"
      ? { errors: { email: "That email already has an account. Sign in instead." }, values }
      : { errors: { dateOfBirth: "You must be 18 or over to join Innit." }, values };
  }
  const session = await createSession(db, result.playerId);
  await setSessionCookie(session.token, session.expiresAt);
  redirect("/account?welcome=1");
}

export async function signIn(_prev: FormState, form: FormData): Promise<FormState> {
  const values = keep(form, ["email"]);
  const parsed = signInSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  const db = getDb();
  if (!db) return NO_DATABASE;
  const result = await authenticate(db, parsed.data.email, parsed.data.password);
  if (!result.ok) {
    return {
      errors: {
        form:
          result.reason === "locked"
            ? "Too many tries. For your security, wait 15 minutes and try again."
            : "That email and password don't match. Check them and try again.",
      },
      values,
    };
  }
  const session = await createSession(db, result.playerId);
  await setSessionCookie(session.token, session.expiresAt);
  redirect("/account");
}

export async function signOut(): Promise<void> {
  const db = getDb();
  if (db) await endSession(db, await readSessionToken());
  await clearSessionCookie();
  redirect("/");
}
