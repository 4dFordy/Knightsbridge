import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { brand, colours, findBannedPhrases } from "./brand";

const SRC = join(__dirname, "..");

describe("brand values", () => {
  it("uses exactly the colours in the owner's handover", () => {
    expect(colours).toEqual({
      navy: "#262834",
      night: "#1E2029",
      card: "#30333F",
      line: "#3D404E",
      gold: "#C9AE7C",
      buttonGold: "#D4BC8E",
      paleGold: "#E6D5AF",
      ivory: "#F7F3EA",
      muted: "#A3A6B2",
      urgent: "#F2A08C",
    });
  });

  it("keeps the CSS colour tokens in sync with brand.ts", () => {
    const css = readFileSync(join(SRC, "app", "globals.css"), "utf8");
    const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
    for (const [name, hex] of Object.entries(colours)) {
      expect(css, `--color-${kebab(name)}`).toMatch(new RegExp(`--color-${kebab(name)}:\\s*${hex};`, "i"));
    }
  });

  it("has the approved lines", () => {
    expect(brand.wordmark).toBe("innit");
    expect(brand.brandLine).toBe("Gotta be innit to win it.");
    expect(brand.campaignLine).toBe("Be in it.");
  });

  it("contains no banned phrases", () => {
    expect(findBannedPhrases(JSON.stringify(brand))).toEqual([]);
  });
});

describe("findBannedPhrases", () => {
  it("catches banned phrases in any letter case", () => {
    expect(findBannedPhrases("This could CHANGE YOUR LIFE. Easy Money!")).toEqual([
      "change your life",
      "easy money",
    ]);
    expect(findBannedPhrases("Last chance!!!")).toEqual(["last chance"]);
  });

  it("passes honest copy", () => {
    expect(findBannedPhrases("You in? Closes Tuesday at 20:00. Max 2,200 entries.")).toEqual([]);
  });
});

describe("no Knightsbridge branding in the product", () => {
  function sourceFiles(dir: string): string[] {
    return readdirSync(dir).flatMap((entry) => {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) return sourceFiles(path);
      return /\.(tsx?|css)$/.test(entry) && !/\.test\.tsx?$/.test(entry) ? [path] : [];
    });
  }

  it("never mentions Knightsbridge or the endorsement line in app code", () => {
    const offenders = sourceFiles(SRC).filter((file) =>
      /knightsbridge|a part of/i.test(readFileSync(file, "utf8")),
    );
    expect(offenders).toEqual([]);
  });
});
