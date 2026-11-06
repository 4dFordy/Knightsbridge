/**
 * DEMO_MODE (AGENTS.md rule 20): sample draws and numbers for previews only, always labelled "demo".
 * It can never be on in production: the build and the server both refuse to start if it is.
 */
type Env = Record<string, string | undefined>;

export function isDemoMode(env: Env = process.env): boolean {
  return env.DEMO_MODE === "true";
}

/** True on Vercel's production environment. Local builds and previews are not production. */
export function isProductionDeployment(env: Env = process.env): boolean {
  return env.VERCEL_ENV === "production";
}

export function assertDemoModeAllowed(env: Env = process.env): void {
  if (isDemoMode(env) && isProductionDeployment(env)) {
    throw new Error(
      "DEMO_MODE=true is not allowed in production. Remove DEMO_MODE from the Production environment variables.",
    );
  }
}
