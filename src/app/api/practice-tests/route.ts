import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/session";
import {
  createPracticeTest,
  listPracticeTests,
  type PracticeCourse,
  type PracticeSource,
} from "@/lib/server/practice-tests";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.status !== "approved") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ tests: listPracticeTests() });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.status !== "approved") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    let filePayload:
      | { name: string; mime: string; buffer: Buffer }
      | undefined;

    if (file instanceof File && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      filePayload = {
        name: file.name || "practice-test.pdf",
        mime: file.type || "application/octet-stream",
        buffer,
      };
    }

    const test = createPracticeTest({
      title: String(form.get("title") || ""),
      description: String(form.get("description") || ""),
      course: String(form.get("course") || "both") as PracticeCourse,
      source: String(form.get("source") || "ai") as PracticeSource,
      aiTool: form.get("aiTool") ? String(form.get("aiTool")) : undefined,
      textContent: form.get("textContent")
        ? String(form.get("textContent"))
        : undefined,
      file: filePayload,
      uploadedById: user.id,
      uploadedByName: user.name,
    });

    return NextResponse.json({ test });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not save practice test.",
      },
      { status: 400 },
    );
  }
}
