import { appIconSvg, logoSvg, type LogoGround, type LogoVariant } from "./logo";

const GROUNDS: LogoGround[] = ["navy", "gold", "ivory"];
const LOCKUPS: Exclude<LogoVariant, "ticket">[] = ["horizontal", "stacked", "wordmark", "nav"];

/**
 * Every downloadable logo file, named as in the logo specification's file list (A11),
 * served as vector SVG at /logo/<name>. Transparent backgrounds, except the app icon.
 */
export const LOGO_FILES: Record<string, () => string> = {
  ...Object.fromEntries(
    LOCKUPS.flatMap((variant) =>
      GROUNDS.map((ground) => [`innit-${variant}-${ground}.svg`, () => logoSvg(variant, ground)]),
    ),
  ),
  "innit-ticket.svg": () => logoSvg("ticket", "navy"),
  "innit-app-icon.svg": () => appIconSvg(),
};
