import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/server/session";
import { authenticateUser } from "@/lib/server/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const user = authenticateUser(
    String(body.email || ""),
    String(body.password || ""),
  );
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }
  await setSessionCookie(user);
  return NextResponse.json({ user });
}
