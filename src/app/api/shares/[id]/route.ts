import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/session";
import { deleteShare } from "@/lib/server/shares";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getSessionUser();
  if (!user || user.status !== "approved") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  try {
    const ok = deleteShare(id, { id: user.id, role: user.role });
    if (!ok) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not delete." },
      { status: 400 },
    );
  }
}
