import { describe, expect, it } from "vitest";
import { fieldErrors, signInSchema, signUpSchema } from "./validation";

const now = () => new Date("2026-11-06T12:00:00Z");
const valid = {
  firstName: " Sam ",
  lastName: "Jones",
  email: "  Sam.Jones@Example.COM ",
  password: "correct horse battery",
  dateOfBirth: "1995-04-12",
  confirmAdultInGB: "on",
};

describe("sign-up form", () => {
  it("accepts a valid form and tidies the email", () => {
    const r = signUpSchema(now).parse(valid);
    expect(r.email).toBe("sam.jones@example.com");
    expect(r.firstName).toBe("Sam");
    expect(r.dateOfBirth).toEqual({ year: 1995, month: 4, day: 12 });
  });

  it("rejects under-18s", () => {
    const r = signUpSchema(now).safeParse({ ...valid, dateOfBirth: "2008-11-07" });
    expect(r.success).toBe(false);
    expect(fieldErrors(r.error!).dateOfBirth).toMatch(/18 or over/);
  });

  it("accepts someone on their 18th birthday", () => {
    expect(signUpSchema(now).safeParse({ ...valid, dateOfBirth: "2008-11-06" }).success).toBe(true);
  });

  it("requires the 18+ and Great Britain confirmation", () => {
    const r = signUpSchema(now).safeParse({ ...valid, confirmAdultInGB: undefined });
    expect(fieldErrors(r.error!).confirmAdultInGB).toBeTruthy();
  });

  it("explains a date that doesn't exist", () => {
    const r = signUpSchema(now).safeParse({ ...valid, dateOfBirth: "2010-02-29" });
    expect(fieldErrors(r.error!).dateOfBirth).toMatch(/doesn't exist/);
  });

  it("requires a password of at least 10 characters", () => {
    const r = signUpSchema(now).safeParse({ ...valid, password: "short" });
    expect(fieldErrors(r.error!).password).toMatch(/10 characters/);
  });

  it("explains a bad email in plain English", () => {
    const r = signUpSchema(now).safeParse({ ...valid, email: "not-an-email" });
    expect(fieldErrors(r.error!).email).toMatch(/valid email/);
  });
});

describe("sign-in form", () => {
  it("needs an email and a password", () => {
    const r = signInSchema.safeParse({ email: "", password: "" });
    expect(Object.keys(fieldErrors(r.error!))).toEqual(expect.arrayContaining(["email", "password"]));
  });
});

describe("date of birth boxes", () => {
  it("joins Day, Month and Year into a date", async () => {
    const { dateOfBirthFromForm } = await import("./validation");
    expect(dateOfBirthFromForm("7", "3", "1990")).toBe("1990-03-07");
    expect(dateOfBirthFromForm("", "3", "1990")).toBe("");
    expect(dateOfBirthFromForm("7", "3", "90")).toBe("");
  });
});
