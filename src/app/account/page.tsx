import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Your account" };

export default function Page() {
  return <ComingSoon title="Your account." phase="Phase 1 (task 5) and Phase 4" />;
}
