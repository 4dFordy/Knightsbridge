import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Get in" };

export default function Page() {
  return <ComingSoon title="Get in." phase="Phase 1 (task 5)" />;
}
