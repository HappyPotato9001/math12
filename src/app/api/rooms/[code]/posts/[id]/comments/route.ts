import { NextResponse } from "next/server";
import { createComment } from "@/lib/db";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ code: string; id: string }> };

export async function POST(request: Request, { params }: Params) {
  const { code, id } = await params;
  const body = await request.json();
  if (!String(body.body || "").trim()) {
    return NextResponse.json(
      { error: "Comment cannot be empty." },
      { status: 400 },
    );
  }
  const comment = createComment({
    roomCode: code,
    postId: id,
    authorId: String(body.authorId || ""),
    body: String(body.body || ""),
  });
  if (!comment) {
    return NextResponse.json(
      { error: "Could not add comment. Join this room first." },
      { status: 400 },
    );
  }
  return NextResponse.json(comment);
}
