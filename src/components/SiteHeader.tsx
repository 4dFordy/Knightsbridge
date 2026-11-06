import Link from "next/link";
import { brand } from "@/brand/brand";
import { SITE_NAV } from "@/brand/navigation";
import { AccountLinks } from "@/components/AccountLinks";
import { Logo } from "@/components/Logo";
import { NavLinks } from "@/components/NavLinks";
import { SolicitorPlaceholder } from "@/components/SolicitorPlaceholder";

/** Top of every page: logo, menu (laptop), sign in / get in, and the brand strip. */
export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <Link href="/" aria-label={`${brand.name} home`} className="inline-flex min-h-11 items-center">
          <Logo variant="nav" ground="navy" width={140} />
        </Link>
        <nav aria-label="Site" className="hidden md:block">
          <NavLinks items={SITE_NAV} />
        </nav>
        <div className="flex items-center gap-2">
          <AccountLinks />
        </div>
      </div>
      <div className="border-t border-line bg-night">
        <p className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-pale-gold sm:px-8">
          <span>{brand.brandLine}</span>
          <span aria-hidden="true">·</span>
          <SolicitorPlaceholder id="18+ statement" />
          <span aria-hidden="true">·</span>
          <SolicitorPlaceholder id="free entry wording" />
        </p>
      </div>
    </header>
  );
}
