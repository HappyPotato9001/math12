import { NextResponse } from "next/server";
import { getSessionUser, setSessionCookie } from "@/lib/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  await setSessionCookie(user);
  return NextResponse.json({ user });
}
