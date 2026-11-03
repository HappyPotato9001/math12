import { NextResponse } from "next/server";
import { createRoom, joinRoom } from "@/lib/db";

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
    const result = createRoom(String(body.name || ""), displayName);
    return NextResponse.json(result);
  }

  if (body.action === "join") {
    const result = joinRoom(String(body.code || ""), displayName);
    if (!result) {
      return NextResponse.json(
        { error: "No room found for that code." },
        { status: 404 },
      );
    }
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
