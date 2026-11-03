import { NextResponse } from "next/server";
import { createPost, listPosts } from "@/lib/server/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ code: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { code } = await params;
  return NextResponse.json({ posts: listPosts(code) });
}

export async function POST(request: Request, { params }: Params) {
  const { code } = await params;
  const body = await request.json();
  const post = createPost({
    roomCode: code,
    authorId: String(body.authorId || ""),
    topicPath: String(body.topicPath || ""),
    topicTitle: String(body.topicTitle || ""),
    problemId: String(body.problemId || ""),
    problemPrompt: String(body.problemPrompt || ""),
    workText: String(body.workText || ""),
    answer: String(body.answer || ""),
    isCorrect: Boolean(body.isCorrect),
    imageId: body.imageId ? String(body.imageId) : undefined,
  });
  if (!post) {
    return NextResponse.json(
      { error: "Could not create post. Join the room first." },
      { status: 400 },
    );
  }
  return NextResponse.json(post);
}
