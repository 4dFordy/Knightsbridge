import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Sign in" };

export default function Page() {
  return <ComingSoon title="Sign in." phase="Phase 1 (task 5)" />;
}
