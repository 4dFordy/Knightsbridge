import type { NextConfig } from "next";
import { assertDemoModeAllowed } from "./src/lib/env";

// Stop a production build with demo data switched on before it can ever be deployed.
assertDemoModeAllowed();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Native password-hashing library: load it from node_modules at runtime, don't bundle it.
  serverExternalPackages: ["@node-rs/argon2"],
};

export default nextConfig;
