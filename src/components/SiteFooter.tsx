import Link from "next/link";
import { SolicitorPlaceholder } from "@/components/SolicitorPlaceholder";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto max-w-6xl space-y-2 px-4 py-6 text-sm text-muted sm:px-8">
        <p>
          <SolicitorPlaceholder id="18+ statement" />
        </p>
        <p>
          <SolicitorPlaceholder id="free entry wording" />{" "}
          <Link href="/free-entry" className="underline hover:text-ivory">
            Free entry
          </Link>
        </p>
      </div>
    </footer>
  );
}
