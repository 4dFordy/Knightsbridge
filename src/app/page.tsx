import { brand } from "@/brand/brand";
import { Logo } from "@/components/Logo";
import { SolicitorPlaceholder } from "@/components/SolicitorPlaceholder";

/**
 * Holding page for Phase 1. The real home page (hero draw with its prize photo beside the text,
 * "What's on" grid) is built in Phase 7.
 */
export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-line px-4 py-4 sm:px-8">
        <Logo variant="nav" ground="navy" width={140} />
      </header>

      <main className="flex flex-1 flex-col">
        <section className="bg-gold px-4 py-16 text-night sm:px-8 sm:py-24">
          <h1 className="font-display text-5xl font-black tracking-tight sm:text-7xl">
            {brand.campaignLine}
          </h1>
          <p className="mt-4 font-display text-xl font-black sm:text-2xl">{brand.brandLine}</p>
        </section>

        <section className="px-4 py-10 sm:px-8">
          <p className="max-w-prose text-lg text-pale-gold">
            We&rsquo;re building the new {brand.name} website. Nothing is on sale yet.
          </p>
        </section>
      </main>

      <footer className="space-y-2 border-t border-line px-4 py-6 text-sm text-muted sm:px-8">
        <p>
          <SolicitorPlaceholder id="18+ statement" />
        </p>
        <p>
          <SolicitorPlaceholder id="free entry wording" />
        </p>
      </footer>
    </div>
  );
}
