"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ACCOUNT_LINKS } from "@/brand/navigation";

const HINT = "innit_signed_in=1";
const subscribe = () => () => {};
const signedInHint = () => document.cookie.split("; ").includes(HINT);

/**
 * Header buttons. Pages stay fast (no per-visitor rendering); after loading, the browser swaps
 * "Sign in / Get in" for "Account" if the signed-in marker cookie is present.
 */
export function AccountLinks() {
  const signedIn = useSyncExternalStore(subscribe, signedInHint, () => false);
  if (signedIn) {
    return (
      <Link
        href="/account"
        className="inline-flex min-h-11 items-center rounded-lg border border-line px-4 text-sm font-bold text-ivory hover:border-gold"
      >
        Account
      </Link>
    );
  }
  return (
    <>
      <Link
        href={ACCOUNT_LINKS.signIn.href}
        className="inline-flex min-h-11 items-center rounded-lg border border-line px-4 text-sm font-bold text-ivory hover:border-gold"
      >
        {ACCOUNT_LINKS.signIn.label}
      </Link>
      <Link
        href={ACCOUNT_LINKS.getIn.href}
        className="hidden min-h-11 items-center rounded-lg bg-button-gold px-4 text-sm font-bold text-night hover:bg-pale-gold sm:inline-flex"
      >
        {ACCOUNT_LINKS.getIn.label}
      </Link>
    </>
  );
}
