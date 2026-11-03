import path from "path";
import { nanoid } from "nanoid";
import { deleteBinary, readBinary, readJson, writeBinary, writeJson } from "./persist";

export type PracticeCourse = "math1" | "math2" | "both";
export type PracticeSource = "ai" | "teacher" | "student" | "other";

export type PracticeTest = {
  id: string;
  title: string;
  description: string;
  course: PracticeCourse;
  source: PracticeSource;
  aiTool?: string;
  textContent?: string;
  fileName?: string;
  fileMime?: string;
  hasFile: boolean;
  uploadedById: string;
  uploadedByName: string;
  createdAt: string;
};

type Store = { tests: PracticeTest[] };

const STORE = "practice-tests.json";

const ALLOWED_MIME = new Set([
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const MAX_BYTES = 8 * 1024 * 1024;

async function ensureStore(): Promise<Store> {
  return readJson<Store>(STORE, { tests: [] });
}

async function writeStore(store: Store) {
  await writeJson(STORE, store);
}

function binaryKey(id: string, fileName: string) {
  const safeExt = path.extname(fileName).slice(0, 12) || ".bin";
  return path.posix.join("practice-test-files", `${id}${safeExt}`);
}

export async function listPracticeTests() {
  return (await ensureStore())
    .tests.slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPracticeTest(id: string) {
  return (await ensureStore()).tests.find((test) => test.id === id) ?? null;
}

export async function getPracticeTestFile(id: string) {
  const test = await getPracticeTest(id);
  if (!test?.hasFile || !test.fileName) return null;
  const buffer = await readBinary(binaryKey(id, test.fileName));
  if (!buffer) return null;
  return {
    test,
    buffer,
    fileName: test.fileName,
    mime: test.fileMime || "application/octet-stream",
  };
}

export async function createPracticeTest(input: {
  title: string;
  description: string;
  course: PracticeCourse;
  source: PracticeSource;
  aiTool?: string;
  textContent?: string;
  file?: { name: string; mime: string; buffer: Buffer };
  uploadedById: string;
  uploadedByName: string;
}) {
  const title = input.title.trim();
  const description = input.description.trim();
  const textContent = input.textContent?.trim() || undefined;

  if (!title || title.length > 140) {
    throw new Error("Title is required (max 140 characters).");
  }
  if (description.length > 1000) {
    throw new Error("Description is too long.");
  }
  if (!["math1", "math2", "both"].includes(input.course)) {
    throw new Error("Pick Math 1, Math 2, or both.");
  }
  if (!["ai", "teacher", "student", "other"].includes(input.source)) {
    throw new Error("Pick a valid source.");
  }
  if (!textContent && !input.file) {
    throw new Error("Paste the practice test or upload a file.");
  }
  if (textContent && textContent.length > 100_000) {
    throw new Error("Pasted text is too long.");
  }
  if (input.file) {
    if (input.file.buffer.byteLength > MAX_BYTES) {
      throw new Error("File must be 8 MB or smaller.");
    }
    if (
      !ALLOWED_MIME.has(input.file.mime) &&
      !input.file.name.match(/\.(pdf|txt|md|docx?)$/i)
    ) {
      throw new Error("Upload a PDF, Word doc, or text/markdown file.");
    }
  }

  const aiTool =
    input.source === "ai" ? input.aiTool?.trim().slice(0, 80) || undefined : undefined;

  const id = nanoid(12);
  let fileName: string | undefined;
  let fileMime: string | undefined;
  let hasFile = false;

  if (input.file) {
    fileName = input.file.name.slice(0, 180);
    fileMime = input.file.mime || "application/octet-stream";
    hasFile = true;
    await writeBinary(binaryKey(id, fileName), input.file.buffer);
  }

  const store = await ensureStore();
  const test: PracticeTest = {
    id,
    title,
    description,
    course: input.course,
    source: input.source,
    aiTool,
    textContent,
    fileName,
    fileMime,
    hasFile,
    uploadedById: input.uploadedById,
    uploadedByName: input.uploadedByName,
    createdAt: new Date().toISOString(),
  };
  store.tests.unshift(test);
  await writeStore(store);
  return test;
}

export async function deletePracticeTest(
  id: string,
  requester: { id: string; role: string },
) {
  const store = await ensureStore();
  const index = store.tests.findIndex((test) => test.id === id);
  if (index < 0) return false;
  const test = store.tests[index];
  if (test.uploadedById !== requester.id && requester.role !== "admin") {
    throw new Error("You can only delete your own practice tests.");
  }
  if (test.hasFile && test.fileName) {
    await deleteBinary(binaryKey(id, test.fileName));
  }
  store.tests.splice(index, 1);
  await writeStore(store);
  return true;
}
