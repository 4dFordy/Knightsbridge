import { ImageResponse } from "next/og";
import { appIconSvg } from "@/brand/logo/logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iPhone home-screen icon. Square: iOS applies its own rounded mask (spec A8).
export default function AppleIcon() {
  const src = `data:image/svg+xml;base64,${Buffer.from(appIconSvg()).toString("base64")}`;
  return new ImageResponse(<img src={src} width={180} height={180} alt="" />, size);
}
