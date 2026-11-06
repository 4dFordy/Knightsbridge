import { assertDemoModeAllowed } from "@/lib/env";

/** Runs once when the server starts. Refuses to start with demo data switched on in production. */
export function register() {
  assertDemoModeAllowed();
}
