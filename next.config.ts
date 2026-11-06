import type { NextConfig } from "next";
import { assertDemoModeAllowed } from "./src/lib/env";

// Stop a production build with demo data switched on before it can ever be deployed.
assertDemoModeAllowed();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
