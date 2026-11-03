import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { getDataDir } from "./data-dir";

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

function storePath() {
  return path.join(getDataDir(), "practice-tests.json");
}

function filesDir() {
  return path.join(getDataDir(), "practice-test-files");
}

const ALLOWED_MIME = new Set([
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const MAX_BYTES = 8 * 1024 * 1024;

function ensureDirs() {
  fs.mkdirSync(filesDir(), { recursive: true });
}

function ensureStore(): Store {
  ensureDirs();
  const file = storePath();
  if (!fs.existsSync(file)) {
    const initial: Store = { tests: [] };
    fs.writeFileSync(file, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(file, "utf8")) as Store;
}

function writeStore(store: Store) {
  ensureDirs();
  fs.writeFileSync(storePath(), JSON.stringify(store, null, 2));
}

function filePathFor(id: string, fileName: string) {
  const safeExt = path.extname(fileName).slice(0, 12) || ".bin";
  return path.join(filesDir(), `${id}${safeExt}`);
}

export function listPracticeTests() {
  return ensureStore()
    .tests.slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getPracticeTest(id: string) {
  return ensureStore().tests.find((test) => test.id === id) ?? null;
}

export function getPracticeTestFile(id: string) {
  const test = getPracticeTest(id);
  if (!test?.hasFile || !test.fileName) return null;
  const filePath = filePathFor(id, test.fileName);
  if (!fs.existsSync(filePath)) return null;
  return {
    test,
    buffer: fs.readFileSync(filePath),
    fileName: test.fileName,
    mime: test.fileMime || "application/octet-stream",
  };
}

export function createPracticeTest(input: {
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
    ensureDirs();
    fileName = input.file.name.slice(0, 180);
    fileMime = input.file.mime || "application/octet-stream";
    hasFile = true;
    fs.writeFileSync(filePathFor(id, fileName), input.file.buffer);
  }

  const store = ensureStore();
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
  writeStore(store);
  return test;
}

export function deletePracticeTest(
  id: string,
  requester: { id: string; role: string },
) {
  const store = ensureStore();
  const index = store.tests.findIndex((test) => test.id === id);
  if (index < 0) return false;
  const test = store.tests[index];
  if (test.uploadedById !== requester.id && requester.role !== "admin") {
    throw new Error("You can only delete your own practice tests.");
  }
  if (test.hasFile && test.fileName) {
    const filePath = filePathFor(id, test.fileName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  store.tests.splice(index, 1);
  writeStore(store);
  return true;
}
