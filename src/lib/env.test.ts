import { describe, expect, it } from "vitest";
import { assertDemoModeAllowed, isDemoMode } from "./env";

describe("DEMO_MODE", () => {
  it("is only on when DEMO_MODE is exactly 'true'", () => {
    expect(isDemoMode({ DEMO_MODE: "true" })).toBe(true);
    expect(isDemoMode({ DEMO_MODE: "1" })).toBe(false);
    expect(isDemoMode({})).toBe(false);
  });

  it("can never be on in production", () => {
    expect(() => assertDemoModeAllowed({ DEMO_MODE: "true", VERCEL_ENV: "production" })).toThrow(/not allowed/);
  });

  it("is allowed on previews and locally", () => {
    expect(() => assertDemoModeAllowed({ DEMO_MODE: "true", VERCEL_ENV: "preview" })).not.toThrow();
    expect(() => assertDemoModeAllowed({ DEMO_MODE: "true" })).not.toThrow();
    expect(() => assertDemoModeAllowed({ VERCEL_ENV: "production" })).not.toThrow();
  });
});
