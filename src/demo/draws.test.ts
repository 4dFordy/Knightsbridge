import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { findBannedPhrases } from "@/brand/brand";
import { demoDraws, formatPounds, maxEntries } from "./draws";

const draws = demoDraws(new Date("2026-11-06T12:00:00Z"));

describe("sample draws (demo only)", () => {
  it("use entry prices from £5 to £30", () => {
    for (const d of draws) {
      expect(d.pricePence).toBeGreaterThanOrEqual(500);
      expect(d.pricePence).toBeLessThanOrEqual(3000);
    }
  });

  it("follow the cap rule: entries × price is about 2.2× prize cost, never below 2.0×", () => {
    for (const d of draws) {
      const multiple = (d.maxEntries * d.pricePence) / d.prizeCostPence;
      expect(multiple, d.slug).toBeGreaterThanOrEqual(2.0);
      expect(multiple, d.slug).toBeLessThanOrEqual(2.2);
    }
    expect(maxEntries({ prizeCostPence: 1_000_000, pricePence: 1000 })).toBe(2200);
  });

  it("keep cash alternatives within 80–90% of the prize value", () => {
    for (const d of draws.filter((x) => x.cashAlternativePence !== null)) {
      const share = d.cashAlternativePence! / d.prizeValuePence;
      expect(share, d.slug).toBeGreaterThanOrEqual(0.8);
      expect(share, d.slug).toBeLessThanOrEqual(0.9);
    }
  });

  it("never show more sold than the cap, and close on a future draw night", () => {
    for (const d of draws) {
      expect(d.sold).toBeLessThanOrEqual(d.maxEntries);
      expect(d.closesAt.getTime()).toBeGreaterThan(new Date("2026-11-06T12:00:00Z").getTime());
    }
  });

  it("use photos that exist in public/prizes", () => {
    for (const d of draws) expect(existsSync(join(process.cwd(), "public", d.image)), d.image).toBe(true);
  });

  it("use no banned phrases", () => {
    expect(findBannedPhrases(JSON.stringify(draws))).toEqual([]);
  });

  it("formats prices in pounds", () => {
    expect(formatPounds(2500)).toBe("£25");
    expect(formatPounds(36_000_000)).toBe("£360,000");
  });
});
