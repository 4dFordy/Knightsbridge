import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Live draws" };

export default function Page() {
  return <ComingSoon title="Live draws." phase="Phase 6" />;
}
