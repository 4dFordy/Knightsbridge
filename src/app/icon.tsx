import { ImageResponse } from "next/og";
import { appIconSvg } from "@/brand/logo/logo";

// Favicon and PWA icons: the app icon (gold ticket on navy), spec A8.
export function generateImageMetadata() {
  return [32, 192, 512].map((size) => ({
    id: String(size),
    size: { width: size, height: size },
    contentType: "image/png",
  }));
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const size = Number(await id);
  const src = `data:image/svg+xml;base64,${Buffer.from(appIconSvg()).toString("base64")}`;
  return new ImageResponse(<img src={src} width={size} height={size} alt="" />, { width: size, height: size });
}
