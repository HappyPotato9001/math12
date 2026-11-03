import { NextResponse } from "next/server";
import { getSessionUser, setSessionCookie } from "@/lib/server/session";
import { getUserById, setUserStatus, type UserStatus } from "@/lib/server/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const admin = await getSessionUser();
  if (!admin || admin.role !== "admin" || admin.status !== "approved") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const status = String(body.status || "") as UserStatus;
  if (!["pending", "approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  try {
    const updated = setUserStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    // If admin somehow edits themselves, refresh cookie.
    if (admin.id === id) {
      const fresh = getUserById(id);
      if (fresh) await setSessionCookie(fresh);
    }
    return NextResponse.json({ user: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed." },
      { status: 400 },
    );
  }
}
