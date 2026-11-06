import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "How it works" };

export default function Page() {
  return <ComingSoon title="How it works." phase="Phase 7" />;
}
