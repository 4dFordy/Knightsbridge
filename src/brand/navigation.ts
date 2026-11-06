/** Site navigation (brand book "Website and app"). Labels live here, not in components. */
export const SITE_NAV = [
  { href: "/", label: "What's on" },
  { href: "/winners", label: "Winners" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/free-entry", label: "Free entry" },
] as const;

/** App-style tab bar on phones. */
export const TABS = [
  { href: "/", label: "Home" },
  { href: "/live", label: "Live" },
  { href: "/entries", label: "Entries" },
  { href: "/account", label: "Account" },
] as const;

export const ACCOUNT_LINKS = {
  signIn: { href: "/sign-in", label: "Sign in" },
  getIn: { href: "/get-in", label: "Get in" },
} as const;

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
