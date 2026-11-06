import { z } from "zod";
import { isAdult, parseCalendarDate } from "@/lib/age";
import { PASSWORD_MAX, PASSWORD_MIN } from "./rules";

export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

const email = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .max(254, "That email address is too long.")
  .email("Enter a valid email address, like name@example.com.")
  .transform(normaliseEmail);

const name = (label: string) =>
  z.string().trim().min(1, `Enter your ${label}.`).max(100, `Your ${label} is too long.`);

export function signUpSchema(now: () => Date = () => new Date()) {
  return z.object({
    firstName: name("first name"),
    lastName: name("last name"),
    email,
    password: z
      .string()
      .min(PASSWORD_MIN, `Use at least ${PASSWORD_MIN} characters.`)
      .max(PASSWORD_MAX, `Use ${PASSWORD_MAX} characters or fewer.`),
    dateOfBirth: z
      .string()
      .transform((v, ctx) => {
        const d = parseCalendarDate(v);
        if (!d) {
          ctx.addIssue({
            code: "custom",
            message: v ? "That date doesn't exist. Check the day and month." : "Enter your date of birth, with the year in full.",
          });
          return z.NEVER;
        }
        return d;
      })
      .refine((d) => isAdult(d, now()), "You must be 18 or over to join Innit."),
    confirmAdultInGB: z.literal("on", { error: "Please confirm to continue." }),
  });
}

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password.").max(PASSWORD_MAX),
});

export type FieldErrors = Partial<Record<string, string>>;

/** Joins the Day, Month and Year boxes into YYYY-MM-DD (an empty string if any box is blank). */
export function dateOfBirthFromForm(day: unknown, month: unknown, year: unknown): string {
  const [d, m, y] = [day, month, year].map((v) => String(v ?? "").trim());
  if (!d || !m || !/^\d{4}$/.test(y!)) return "";
  return `${y}-${m!.padStart(2, "0")}-${d!.padStart(2, "0")}`;
}

export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}
