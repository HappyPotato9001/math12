import { NextResponse } from "next/server";
import { getPost } from "@/lib/server/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ code: string; id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { code, id } = await params;
  const post = getPost(code, id);
  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }
  return NextResponse.json({ post });
}
