import { LOGO_FILES } from "@/brand/logo/files";

export const dynamic = "force-static";

export function generateStaticParams() {
  return Object.keys(LOGO_FILES).map((name) => ({ name }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const file = LOGO_FILES[name];
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(file(), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
