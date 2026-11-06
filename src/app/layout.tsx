import type { Metadata, Viewport } from "next";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/900.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/700.css";
import "./globals.css";
import { brand, colours } from "@/brand/brand";

export const metadata: Metadata = {
  title: brand.name,
  description: brand.brandLine,
  // Nothing is public yet: keep previews out of search engines.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: colours.navy,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body className="antialiased">{children}</body>
    </html>
  );
}
