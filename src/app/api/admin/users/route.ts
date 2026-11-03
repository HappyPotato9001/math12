import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/session";
import { listUsers } from "@/lib/server/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin" || user.status !== "approved") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ users: await listUsers() });
}
