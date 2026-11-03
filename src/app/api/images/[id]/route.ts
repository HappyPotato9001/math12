import { NextResponse } from "next/server";
import { readImage } from "@/lib/server/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const image = readImage(id);
  if (!image) {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }
  return new NextResponse(image.buffer, {
    headers: {
      "Content-Type": image.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
