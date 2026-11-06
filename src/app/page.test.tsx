import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { findBannedPhrases } from "@/brand/brand";
import HomePage from "./page";

describe("holding home page", () => {
  it("shows the campaign line as the main heading and the brand line", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveProperty("textContent", "Be in it.");
    expect(screen.getByText("Gotta be innit to win it.")).toBeTruthy();
  });

  it("uses solicitor placeholders for the 18+ and free entry wording", () => {
    const { container } = render(<HomePage />);
    const ids = [...container.querySelectorAll("[data-solicitor-placeholder]")].map((el) =>
      el.getAttribute("data-solicitor-placeholder"),
    );
    expect(ids).toEqual(expect.arrayContaining(["18+ statement", "free entry wording"]));
  });

  it("says nothing is on sale and uses no banned phrases or Knightsbridge branding", () => {
    const { container } = render(<HomePage />);
    const text = container.textContent ?? "";
    expect(text).toContain("Nothing is on sale yet.");
    expect(findBannedPhrases(text)).toEqual([]);
    expect(text).not.toMatch(/knightsbridge/i);
  });
});
