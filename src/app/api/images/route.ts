import { NextResponse } from "next/server";
import { saveImageDataUrl } from "@/lib/server/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const dataUrl = String(body.dataUrl || "");
    if (!dataUrl.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Expected an image data URL." },
        { status: 400 },
      );
    }
    const id = saveImageDataUrl(dataUrl);
    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not save image.",
      },
      { status: 400 },
    );
  }
}
