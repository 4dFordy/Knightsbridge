import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { colours } from "@/brand/brand";
import { Logo } from "@/components/Logo";
import { LOGO_FILES } from "./files";
import { appIconSvg, layout, LOGO_COLOURS, logoSvg } from "./logo";
import { TICKET, ticketGeometry } from "./ticket";
import { WORDMARK } from "./wordmark.generated";

const close = (a: number, b: number) => expect(a).toBeCloseTo(b, 6);

describe("ticket symbol (spec A7)", () => {
  const h = 100;
  const g = ticketGeometry(h);

  it("is 1.36 times as wide as it is tall", () => close(g.width, 136));

  it("has a punch hole 0.38 H across, centred at 0.67 W", () => {
    close(g.hole.r * 2, 38);
    close(g.hole.cx, 0.67 * 136);
    close(g.hole.cy, 50);
  });

  it("has five perforation dashes, 0.045 H × 0.085 H, 0.06 H apart, within 16–84% of the height", () => {
    expect(g.dashes).toHaveLength(5);
    for (const d of g.dashes) {
      close(d.width, 4.5);
      close(d.height, 8.5);
      close(d.x + d.width / 2, 0.34 * 136);
    }
    for (let i = 1; i < g.dashes.length; i++) close(g.dashes[i]!.y - (g.dashes[i - 1]!.y + 8.5), 6);
    expect(g.dashes[0]!.y).toBeGreaterThanOrEqual(16);
    expect(g.dashes.at(-1)!.y + 8.5).toBeLessThanOrEqual(84);
  });

  it("uses the corner and notch radii from the spec", () => {
    expect(TICKET.cornerRadius).toBe(0.16);
    expect(TICKET.notchRadius).toBe(0.14);
  });
});

describe("wordmark (spec A3, A10)", () => {
  it("uses dotless i's with two separate round dots, one stem wide", () => {
    expect(WORDMARK.dots).toHaveLength(2);
    for (const d of WORDMARK.dots) close(d.r * 2, WORDMARK.stemWidth);
  });
});

describe("lockups (spec A3)", () => {
  it("horizontal: ticket 0.62 × font size, 0.13 gap, centred on the cap height", () => {
    const l = layout("horizontal");
    close(l.ticket!.h, 620);
    close(l.wordmark!.x - ticketGeometry(620).width, 130);
    close(l.ticket!.y + 310, l.wordmark!.y - WORDMARK.capHeight / 2);
  });

  it("nav: ticket 0.66 × font size", () => close(layout("nav").ticket!.h, 660));

  it("stacked: ticket 0.70 × font size, 0.07 gap above the i-dots", () => {
    const l = layout("stacked");
    close(l.ticket!.h, 700);
    const dotTop = l.wordmark!.y + WORDMARK.dots[0]!.cy - WORDMARK.dots[0]!.r;
    close(dotTop - (l.ticket!.y + 700), 70);
  });
});

describe("colour versions (spec A4)", () => {
  it("matches the table for navy, gold and ivory grounds", () => {
    expect(LOGO_COLOURS).toEqual({
      navy: { wordmark: colours.ivory, dots: colours.gold, ticket: colours.gold },
      gold: { wordmark: colours.night, dots: colours.ivory, ticket: colours.night },
      ivory: { wordmark: colours.navy, dots: colours.gold, ticket: colours.navy },
    });
  });

  it("app icon is a gold ticket on navy, 46% of the width (spec A8)", () => {
    const svg = appIconSvg();
    expect(svg).toContain(`fill="${colours.navy}"`);
    expect(svg).toContain(`fill="${colours.gold}"`);
  });
});

describe("logo files (spec A11)", () => {
  it("provides every file named in the spec as SVG", () => {
    const expected = ["horizontal", "stacked", "wordmark", "nav"].flatMap((v) =>
      ["navy", "gold", "ivory"].map((g) => `innit-${v}-${g}.svg`),
    );
    expect(Object.keys(LOGO_FILES)).toEqual(
      expect.arrayContaining([...expected, "innit-ticket.svg", "innit-app-icon.svg"]),
    );
  });

  it("never contains an endorsement line, K emblem text or other branding", () => {
    for (const [name, file] of Object.entries(LOGO_FILES)) {
      const svg = file();
      expect(svg, name).toMatch(/^<svg /);
      expect(svg, name).not.toMatch(/knightsbridge|a part of|<text/i);
    }
  });

  it("labels the logo for screen readers", () => {
    expect(logoSvg("horizontal", "navy")).toContain('aria-label="Innit"');
  });
});

describe("<Logo>", () => {
  it("switches horizontal and stacked logos to the ticket alone below 160 px (spec A9)", () => {
    const { container: small } = render(<Logo variant="horizontal" width={120} />);
    expect(small.querySelector("[data-logo]")!.getAttribute("data-logo")).toBe("ticket");
    const { container: big } = render(<Logo variant="horizontal" width={200} />);
    expect(big.querySelector("[data-logo]")!.getAttribute("data-logo")).toBe("horizontal");
  });

  it("keeps the nav logo at its designed 120–160 px size", () => {
    const { container } = render(<Logo variant="nav" width={140} />);
    expect(container.querySelector("[data-logo]")!.getAttribute("data-logo")).toBe("nav");
  });
});
