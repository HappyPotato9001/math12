import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/session";
import {
  createShare,
  listShares,
  type ShareCourse,
} from "@/lib/server/shares";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.status !== "approved") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ posts: listShares() });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.status !== "approved") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const post = createShare({
      title: String(body.title || ""),
      body: String(body.body || ""),
      course: String(body.course || "general") as ShareCourse,
      link: body.link ? String(body.link) : undefined,
      authorId: user.id,
      authorName: user.name,
    });
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not post." },
      { status: 400 },
    );
  }
}
