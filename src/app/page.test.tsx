import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { findBannedPhrases } from "@/brand/brand";
import HomePage from "./page";

afterEach(() => vi.unstubAllEnvs());

describe("home page", () => {
  it("without demo mode: holding page, nothing on sale, no sample draws", () => {
    vi.stubEnv("DEMO_MODE", "");
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Be in it.");
    expect(screen.getByText(/Nothing is on sale yet\./)).toBeTruthy();
    expect(screen.queryByText("Demo")).toBeNull();
  });

  it("with demo mode: sample draws, every one labelled demo", () => {
    vi.stubEnv("DEMO_MODE", "true");
    const { container } = render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Lamborghini Revuelto");
    expect(screen.getByText(/Headline draw · Cars · Demo/)).toBeTruthy();
    const cards = container.querySelectorAll("article");
    expect(cards.length).toBeGreaterThan(0);
    for (const card of cards) expect(card.textContent).toContain("Demo");
  });

  it("shows the entry cap and an odds placeholder next to every price", () => {
    vi.stubEnv("DEMO_MODE", "true");
    const { container } = render(<HomePage />);
    for (const card of container.querySelectorAll("article")) {
      expect(card.textContent).toMatch(/per entry · Max [\d,]+ entries/);
      expect(card.querySelector('[data-solicitor-placeholder="odds statement"]')).not.toBeNull();
    }
  });

  it("uses no banned phrases or Knightsbridge branding", () => {
    vi.stubEnv("DEMO_MODE", "true");
    const { container } = render(<HomePage />);
    expect(findBannedPhrases(container.textContent ?? "")).toEqual([]);
    expect(container.textContent).not.toMatch(/knightsbridge/i);
  });
});
