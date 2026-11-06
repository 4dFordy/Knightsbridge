import Image from "next/image";
import { brand } from "@/brand/brand";
import { DrawCard } from "@/components/DrawCard";
import { CATEGORY_LABELS, demoDraws, formatPounds } from "@/demo/draws";
import { drawNightLabel } from "@/lib/drawNights";
import { isDemoMode } from "@/lib/env";

// Close times move with the calendar, so rebuild the page at least hourly.
export const revalidate = 3600;

/**
 * Home. With DEMO_MODE on (previews only) it shows sample draws, all labelled "demo".
 * Otherwise it is a holding page: nothing is on sale until real draws exist (Phase 2–3).
 */
export default function HomePage() {
  const demo = isDemoMode();
  const draws = demo ? demoDraws() : [];
  // Headline: the biggest prize on sale.
  const headline = [...draws].sort((a, b) => b.prizeValuePence - a.prizeValuePence)[0];
  const rest = draws.filter((d) => d !== headline);

  return (
    <>
      <section className="bg-gold text-night">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:px-8 md:grid-cols-2 md:py-16">
          <div className="space-y-4">
            {headline ? (
              <>
                <p className="inline-flex rounded-full border border-night/40 px-3 py-1 font-display text-[11px] font-bold uppercase tracking-[0.12em]">
                  Headline draw · {CATEGORY_LABELS[headline.category]}
                  {demo && " · Demo"}
                </p>
                <h1 className="font-display text-4xl font-black leading-[1.05] sm:text-5xl">{headline.title}</h1>
                <p className="font-display text-lg font-black">{brand.brandLine}</p>
                <p>
                  {headline.cashAlternativePence !== null &&
                    `${formatPounds(headline.cashAlternativePence)} cash if you'd rather. `}
                  Drawn live {drawNightLabel(headline.closesAt)}. {brand.voice.question}
                </p>
              </>
            ) : (
              <>
                <h1 className="font-display text-5xl font-black leading-[1.05] sm:text-7xl">{brand.campaignLine}</h1>
                <p className="font-display text-xl font-black sm:text-2xl">{brand.brandLine}</p>
              </>
            )}
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-night/10">
            {headline ? (
              <Image
                src={headline.image}
                alt={headline.title}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm font-medium text-night/70">
                Prize photos will go here.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 sm:px-8">
        <h2 className="font-display text-3xl font-black">What&rsquo;s on.</h2>
        {demo ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((d) => (
              <li key={d.slug} className="flex">
                <DrawCard draw={d} demo />
              </li>
            ))}
          </ul>
        ) : (
          <p className="max-w-prose text-lg text-pale-gold">
            We&rsquo;re building the new {brand.name} website. Nothing is on sale yet.
          </p>
        )}
      </section>
    </>
  );
}
