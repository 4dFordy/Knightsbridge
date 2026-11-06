import "server-only";
import { hash, verify } from "@node-rs/argon2";

export { PASSWORD_MAX, PASSWORD_MIN } from "./rules";

// Argon2id with OWASP's recommended settings (19 MiB memory, 2 passes).
const OPTIONS = { memoryCost: 19_456, timeCost: 2, parallelism: 1 } as const;

export function hashPassword(password: string): Promise<string> {
  return hash(password, OPTIONS);
}

export async function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
  try {
    return await verify(passwordHash, password);
  } catch {
    return false;
  }
}

// Used when the email isn't registered, so a wrong email takes as long as a wrong password.
let dummyHash: Promise<string> | undefined;
export async function verifyAgainstDummy(password: string): Promise<false> {
  dummyHash ??= hashPassword("innit-dummy-password-for-timing");
  await verifyPassword(await dummyHash, password);
  return false;
}
