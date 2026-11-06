/**
 * Innit logo lockups, built from the logo specification (brand book A2–A11).
 * One source for every logo on the site, in emails, share images and app icons.
 * No endorsement line, K emblem or any other branding is ever part of the logo.
 */
import { colours } from "@/brand/brand";
import { ticketGeometry, ticketPath } from "./ticket";
import { WORDMARK } from "./wordmark.generated";

export type LogoVariant = "horizontal" | "stacked" | "nav" | "wordmark" | "ticket";
export type LogoGround = "navy" | "gold" | "ivory";

/** Colour versions (A4): what each part is coloured on each background. */
export const LOGO_COLOURS: Record<LogoGround, { wordmark: string; dots: string; ticket: string }> = {
  navy: { wordmark: colours.ivory, dots: colours.gold, ticket: colours.gold },
  gold: { wordmark: colours.night, dots: colours.ivory, ticket: colours.night },
  ivory: { wordmark: colours.navy, dots: colours.gold, ticket: colours.navy },
};

/** Construction rules (A3), as multiples of the wordmark font size. */
export const LOCKUP = {
  horizontal: { ticketHeight: 0.62, gap: 0.13 },
  nav: { ticketHeight: 0.66, gap: 0.13 },
  stacked: { ticketHeight: 0.7, gap: 0.07 },
} as const;

/** Minimum on-screen sizes (A9). */
export const MIN_SIZE = { horizontalWidthPx: 160, ticketHeightPx: 24 } as const;

const FS = WORDMARK.unitsPerEm; // work in font units: 1000 = wordmark font size

type Layout = {
  width: number;
  height: number;
  ticket?: { x: number; y: number; h: number };
  wordmark?: { x: number; y: number }; // baseline origin
};

/** Positions of the ticket and wordmark for each lockup, in font units. */
export function layout(variant: LogoVariant): Layout {
  const wTop = WORDMARK.dots[0]!.cy - WORDMARK.dots[0]!.r; // top of the i-dots (negative = above baseline)
  const wBottom = WORDMARK.letters.maxY;
  const wLeft = WORDMARK.letters.minX;
  const wRight = WORDMARK.letters.maxX;

  if (variant === "ticket") {
    const h = FS;
    return { width: ticketGeometry(h).width, height: h, ticket: { x: 0, y: 0, h } };
  }

  if (variant === "wordmark") {
    return {
      width: wRight - wLeft,
      height: wBottom - wTop,
      wordmark: { x: -wLeft, y: -wTop },
    };
  }

  if (variant === "stacked") {
    const h = LOCKUP.stacked.ticketHeight * FS;
    const tw = ticketGeometry(h).width;
    const gap = LOCKUP.stacked.gap * FS;
    const wordWidth = wRight - wLeft;
    const width = Math.max(tw, wordWidth);
    const ticketY = 0;
    const baseline = h + gap - wTop; // dots start one gap below the ticket
    return {
      width,
      height: baseline + wBottom,
      ticket: { x: (width - tw) / 2, y: ticketY, h },
      wordmark: { x: (width - wordWidth) / 2 - wLeft, y: baseline },
    };
  }

  // horizontal and nav: ticket on the left, centred vertically on the letters' cap height.
  const rule = LOCKUP[variant];
  const h = rule.ticketHeight * FS;
  const tw = ticketGeometry(h).width;
  const gap = rule.gap * FS;
  const ticketCentre = -WORDMARK.capHeight / 2; // relative to baseline
  const top = Math.min(wTop, ticketCentre - h / 2);
  const bottom = Math.max(wBottom, ticketCentre + h / 2);
  const baseline = -top;
  const wordX = tw + gap; // gap measured to the wordmark's origin (A3)
  return {
    width: wordX + wRight,
    height: bottom - top,
    ticket: { x: 0, y: baseline + ticketCentre - h / 2, h },
    wordmark: { x: wordX, y: baseline },
  };
}

const r2 = (v: number) => Number(v.toFixed(2));

/**
 * The logo as an SVG string. Cut-outs (notches, perforation, punch hole) are transparent,
 * so `background` is optional and only used for standalone files.
 */
export function logoSvg(
  variant: LogoVariant,
  ground: LogoGround,
  options: { title?: string; background?: boolean; padding?: number } = {},
): string {
  const { title = "Innit", background = false, padding = 0 } = options;
  const c = LOGO_COLOURS[ground];
  const l = layout(variant);
  const pad = padding * FS;
  const width = l.width + pad * 2;
  const height = l.height + pad * 2;
  const parts: string[] = [];

  if (background) {
    const bg = { navy: colours.navy, gold: colours.gold, ivory: colours.ivory }[ground];
    parts.push(`<rect width="${r2(width)}" height="${r2(height)}" fill="${bg}"/>`);
  }
  if (l.ticket) {
    parts.push(
      `<path fill="${c.ticket}" fill-rule="evenodd" d="${ticketPath(l.ticket.h, l.ticket.x + pad, l.ticket.y + pad)}"/>`,
    );
  }
  if (l.wordmark) {
    const tx = r2(l.wordmark.x + pad);
    const ty = r2(l.wordmark.y + pad);
    parts.push(
      `<g transform="translate(${tx} ${ty})"><path fill="${c.wordmark}" d="${WORDMARK.path}"/>` +
        WORDMARK.dots.map((d) => `<circle fill="${c.dots}" cx="${d.cx}" cy="${d.cy}" r="${d.r}"/>`).join("") +
        `</g>`,
    );
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r2(width)} ${r2(height)}" role="img" aria-label="${title}">` +
    `<title>${title}</title>${parts.join("")}</svg>`
  );
}

/** App icon (A8): gold ticket on navy, ticket = 46% of the icon width, centred, square corners. */
export function appIconSvg(): string {
  const size = 2048;
  const tw = 0.46 * size;
  const th = tw / ticketGeometry(1).width;
  const x = (size - tw) / 2;
  const y = (size - th) / 2;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="Innit">` +
    `<title>Innit</title><rect width="${size}" height="${size}" fill="${colours.navy}"/>` +
    `<path fill="${colours.gold}" fill-rule="evenodd" d="${ticketPath(th, x, y)}"/></svg>`
  );
}

/** Width ÷ height of a lockup, for sizing it in layouts. */
export function aspectRatio(variant: LogoVariant): number {
  const l = layout(variant);
  return l.width / l.height;
}
