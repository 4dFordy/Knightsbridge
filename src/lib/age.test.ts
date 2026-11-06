import { describe, expect, it } from "vitest";
import { ageOn, isAdult, parseCalendarDate, ukToday } from "./age";

const d = (s: string) => parseCalendarDate(s)!;

describe("age (UK calendar)", () => {
  it("turns 18 on the 18th birthday, not the day before", () => {
    expect(ageOn(d("2008-11-06"), d("2026-11-05"))).toBe(17);
    expect(ageOn(d("2008-11-06"), d("2026-11-06"))).toBe(18);
  });

  it("treats a 29 February birthday as 1 March in non-leap years", () => {
    expect(ageOn(d("2008-02-29"), d("2026-02-28"))).toBe(17);
    expect(ageOn(d("2008-02-29"), d("2026-03-01"))).toBe(18);
  });

  it("uses the UK date, not UTC (summer time near midnight)", () => {
    // 23:30 UTC on 30 June 2026 is already 1 July in London (BST).
    expect(ukToday(new Date("2026-06-30T23:30:00Z"))).toEqual({ year: 2026, month: 7, day: 1 });
    expect(isAdult(d("2008-07-01"), new Date("2026-06-30T23:30:00Z"))).toBe(true);
    expect(isAdult(d("2008-07-01"), new Date("2026-06-30T22:30:00Z"))).toBe(false);
  });

  it("rejects impossible dates", () => {
    expect(parseCalendarDate("2025-02-29")).toBeNull();
    expect(parseCalendarDate("06/11/2000")).toBeNull();
  });
});
