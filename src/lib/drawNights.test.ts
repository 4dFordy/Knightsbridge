import { describe, expect, it } from "vitest";
import { drawNightLabel, ukDrawTime, upcomingDrawNights } from "./drawNights";

describe("draw nights: Tue, Thu, Sun at 20:00 UK time", () => {
  it("is 20:00 UTC in winter (GMT) and 19:00 UTC in summer (BST)", () => {
    expect(ukDrawTime(2027, 1, 12).toISOString()).toBe("2027-01-12T20:00:00.000Z");
    expect(ukDrawTime(2027, 4, 6).toISOString()).toBe("2027-04-06T19:00:00.000Z");
  });

  it("lists the next draw nights in order, after now", () => {
    const now = new Date("2026-11-06T12:00:00Z"); // a Friday
    const nights = upcomingDrawNights(now, 4).map(drawNightLabel);
    expect(nights).toEqual(["Sun 20:00", "Tue 20:00", "Thu 20:00", "Sun 20:00"]);
  });

  it("skips tonight's draw once 20:00 has passed", () => {
    const tuesdayLate = new Date("2026-11-10T21:00:00Z");
    expect(upcomingDrawNights(tuesdayLate, 1).map(drawNightLabel)).toEqual(["Thu 20:00"]);
  });

  it("handles the clocks going forward (launch week, 1 April 2027 is a Thursday)", () => {
    const nights = upcomingDrawNights(new Date("2027-03-27T12:00:00Z"), 3);
    expect(nights.map((d) => d.toISOString())).toEqual([
      "2027-03-28T19:00:00.000Z", // Sun, BST started that morning
      "2027-03-30T19:00:00.000Z",
      "2027-04-01T19:00:00.000Z",
    ]);
  });
});
