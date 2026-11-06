import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Winners" };

export default function Page() {
  return <ComingSoon title="Winners." phase="Phase 6" />;
}
