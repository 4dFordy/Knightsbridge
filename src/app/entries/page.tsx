import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Your entries" };

export default function Page() {
  return <ComingSoon title="Your entries." phase="Phase 3" />;
}
