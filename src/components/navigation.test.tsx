import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { isActive, SITE_NAV } from "@/brand/navigation";

const pathname = vi.hoisted(() => ({ value: "/entries" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.value }));

import { NavLinks } from "./NavLinks";
import { TabBar } from "./TabBar";

describe("tab bar (phones)", () => {
  it("has Home, Live, Entries and Account, and marks the current page", () => {
    pathname.value = "/entries";
    render(<TabBar />);
    const links = screen.getAllByRole("link");
    expect(links.map((l) => l.textContent)).toEqual(["Home", "Live", "Entries", "Account"]);
    expect(screen.getByRole("link", { name: "Entries" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Home" }).getAttribute("aria-current")).toBeNull();
  });
});

describe("top menu (laptop)", () => {
  it("has What's on, Winners, How it works and Free entry", () => {
    pathname.value = "/";
    render(<NavLinks items={SITE_NAV} />);
    expect(screen.getAllByRole("link").map((l) => l.textContent)).toEqual([
      "What's on",
      "Winners",
      "How it works",
      "Free entry",
    ]);
    expect(screen.getByRole("link", { name: "What's on" }).getAttribute("aria-current")).toBe("page");
  });
});

describe("isActive", () => {
  it("only marks Home on the home page", () => {
    expect(isActive("/", "/")).toBe(true);
    expect(isActive("/live", "/")).toBe(false);
    expect(isActive("/live/abc", "/live")).toBe(true);
  });
});
