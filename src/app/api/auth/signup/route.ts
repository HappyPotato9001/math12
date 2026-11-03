import { NextResponse } from "next/server";
import { createUser } from "@/lib/server/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await createUser({
      name: String(body.name || ""),
      email: String(body.email || ""),
      password: String(body.password || ""),
    });
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Signup failed." },
      { status: 400 },
    );
  }
}
