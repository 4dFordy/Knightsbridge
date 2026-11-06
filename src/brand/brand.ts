/**
 * The single source of Innit brand values (AGENTS.md section 2).
 * Components read names, lines and colours from here; never hard-code them elsewhere.
 */

export const brand = {
  name: "Innit",
  /** The wordmark is always written in lower case. */
  wordmark: "innit",
  brandLine: "Gotta be innit to win it.",
  campaignLine: "Be in it.",
  voice: {
    question: "You in?",
    cta: "I'm in",
    confirmed: "You're in.",
    lost: "Not this time.",
  },
} as const;

/** Brand colours from the owner's handover. Mirrored as CSS variables in src/app/globals.css. */
export const colours = {
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
} as const;

export type ColourName = keyof typeof colours;

/**
 * Words and phrases Innit never uses (handover section 2 and brand book "Voice").
 * Checked by tests against all brand copy; later phases check templates and messages too.
 */
export const neverSay = [
  "change your life",
  "easy money",
  "guaranteed winner",
  "last chance",
] as const;

/** Returns the banned phrases found in a piece of copy (case-insensitive). */
export function findBannedPhrases(text: string): string[] {
  const lower = text.toLowerCase();
  return neverSay.filter((phrase) => lower.includes(phrase));
}
