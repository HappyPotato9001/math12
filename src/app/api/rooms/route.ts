import { NextResponse } from "next/server";
import { createRoom, joinRoom } from "@/lib/server/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const displayName = String(body.displayName || "").trim();
  if (!displayName) {
    return NextResponse.json(
      { error: "Display name is required." },
      { status: 400 },
    );
  }

  if (body.action === "create") {
    return NextResponse.json(createRoom(String(body.name || ""), displayName));
  }

  if (body.action === "join") {
    return NextResponse.json(joinRoom(String(body.code || ""), displayName));
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
