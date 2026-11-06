import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";
import { SolicitorPlaceholder } from "@/components/SolicitorPlaceholder";

export const metadata: Metadata = { title: "Free entry" };

export default function Page() {
  return (
    <ComingSoon title="Free entry." phase="Phase 5">
      <p>
        <SolicitorPlaceholder id="free entry wording" />
      </p>
    </ComingSoon>
  );
}
