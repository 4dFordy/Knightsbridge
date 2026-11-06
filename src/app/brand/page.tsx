import type { Metadata } from "next";
import { appIconSvg, type LogoGround, type LogoVariant } from "@/brand/logo/logo";
import { LOGO_FILES } from "@/brand/logo/files";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = { title: "Innit logo check" };

const GROUNDS: { ground: LogoGround; className: string; label: string }[] = [
  { ground: "navy", className: "bg-navy border border-line", label: "On navy" },
  { ground: "gold", className: "bg-gold", label: "On gold" },
  { ground: "ivory", className: "bg-ivory", label: "On ivory" },
];

const LOCKUPS: { variant: LogoVariant; title: string; use: string; width: number }[] = [
  { variant: "horizontal", title: "Horizontal (primary)", use: "Website header (large), emails, share images", width: 280 },
  { variant: "stacked", title: "Stacked", use: "Social avatar, story end card, splash screen", width: 200 },
  { variant: "wordmark", title: "Wordmark", use: "Next to the app icon, or where the ticket already appears", width: 220 },
  { variant: "nav", title: "Nav", use: "Website header and app top bar, shown 120–160 px wide", width: 150 },
];

/** Internal page so the owner and designer can check every logo version against the brand book. */
export default function BrandPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-12 px-4 py-10 sm:px-8">
      <header className="space-y-2">
        <h1 className="font-display text-4xl font-black">Logo check.</h1>
        <p className="max-w-prose text-muted">
          Every Innit logo, built from the logo specification in the brand book. Compare each one with pages
          A2–A9. No endorsement line or K emblem appears anywhere.
        </p>
      </header>

      {LOCKUPS.map(({ variant, title, use, width }) => (
        <section key={variant} className="space-y-3">
          <h2 className="font-display text-2xl font-black">{title}</h2>
          <p className="text-sm text-muted">{use}</p>
          <div className="grid gap-4 md:grid-cols-3">
            {GROUNDS.map(({ ground, className, label }) => (
              <figure key={ground} className="space-y-2">
                <div className={`flex h-44 items-center justify-center rounded-xl ${className}`}>
                  <Logo variant={variant} ground={ground} width={width} />
                </div>
                <figcaption className="text-xs text-muted">
                  {label} ·{" "}
                  <a className="underline" href={`/logo/innit-${variant}-${ground}.svg`} download>
                    innit-{variant}-{ground}.svg
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-black">Ticket and app icon</h2>
        <div className="flex flex-wrap items-end gap-6">
          <div className="flex h-44 w-56 items-center justify-center rounded-xl border border-line bg-navy">
            <Logo variant="ticket" width={140} />
          </div>
          {[180, 120, 64, 32, 16].map((size) => (
            <figure key={size} className="space-y-1 text-center">
              <span
                className="block overflow-hidden rounded-[22%] [&>svg]:block [&>svg]:h-full [&>svg]:w-full"
                style={{ width: size, height: size }}
                dangerouslySetInnerHTML={{ __html: appIconSvg() }}
              />
              <figcaption className="text-xs text-muted">{size} px</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-black">Minimum size</h2>
        <p className="max-w-prose text-sm text-muted">
          Below 160 px wide, the horizontal and stacked logos switch to the ticket on its own. This one is asked
          for at 120 px:
        </p>
        <div className="flex h-24 w-56 items-center justify-center rounded-xl border border-line bg-navy">
          <Logo variant="horizontal" width={120} />
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-2xl font-black">Files</h2>
        <ul className="grid gap-1 text-sm sm:grid-cols-2">
          {Object.keys(LOGO_FILES).map((name) => (
            <li key={name}>
              <a className="text-pale-gold underline" href={`/logo/${name}`} download>
                {name}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
