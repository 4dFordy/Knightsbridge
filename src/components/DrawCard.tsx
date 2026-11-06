import Image from "next/image";
import { CATEGORY_LABELS, formatPounds, type DemoDrawView } from "@/demo/draws";
import { drawNightLabel } from "@/lib/drawNights";
import { SolicitorPlaceholder } from "@/components/SolicitorPlaceholder";

const number = new Intl.NumberFormat("en-GB");

/** A draw in the "What's on" grid. Entry cap and odds sit next to the price (brand book "Voice"). */
export function DrawCard({ draw, demo }: { draw: DemoDrawView; demo: boolean }) {
  const percent = Math.floor((draw.sold / draw.maxEntries) * 100);
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-card">
      <div className="relative aspect-[4/3] bg-ivory">
        <Image src={draw.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-night/90 px-3 py-1 text-xs font-bold text-ivory">
          {drawNightLabel(draw.closesAt)}
        </span>
        {demo && (
          <span className="absolute right-3 top-3 rounded-full bg-urgent px-3 py-1 text-xs font-bold text-night">
            Demo
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.12em] text-gold">
          {CATEGORY_LABELS[draw.category]}
        </p>
        <h3 className="font-display text-xl font-black leading-tight">{draw.title}</h3>
        {draw.cashAlternativePence !== null && (
          <p className="text-sm text-muted">Or {formatPounds(draw.cashAlternativePence)} cash if you&rsquo;d rather.</p>
        )}
        <div>
          <div
            className="h-2 overflow-hidden rounded-full bg-line"
            role="progressbar"
            aria-label="Entries sold"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
          >
            <div className="h-full rounded-full bg-gold" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-1 flex justify-between text-xs tabular-nums text-muted">
            <span>
              {number.format(draw.sold)} of {number.format(draw.maxEntries)} entries sold
            </span>
            <span>{percent}%</span>
          </p>
        </div>
        <p className="text-xs text-muted">
          {formatPounds(draw.pricePence)} per entry · Max {number.format(draw.maxEntries)} entries ·{" "}
          <SolicitorPlaceholder id="odds statement" />
        </p>
        <p className="mt-auto pt-1">
          <span
            aria-disabled="true"
            className="inline-flex min-h-11 items-center rounded-lg bg-button-gold/60 px-4 text-sm font-bold text-night"
            title="Entries open in a later phase"
          >
            I&rsquo;m in · {formatPounds(draw.pricePence)}
          </span>
        </p>
      </div>
    </article>
  );
}
