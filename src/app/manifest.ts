import type { MetadataRoute } from "next";
import { brand, colours } from "@/brand/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.name,
    short_name: brand.name,
    description: brand.brandLine,
    start_url: "/",
    display: "standalone",
    background_color: colours.navy,
    theme_color: colours.navy,
    icons: [
      { src: "/icon/192", sizes: "192x192", type: "image/png" },
      { src: "/icon/512", sizes: "512x512", type: "image/png" },
      { src: "/logo/innit-app-icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
