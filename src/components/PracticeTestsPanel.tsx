"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, type FormEvent } from "react";

type PracticeCourse = "math1" | "math2" | "both";
type PracticeSource = "ai" | "teacher" | "student" | "other";

type PracticeTest = {
  id: string;
  title: string;
  description: string;
  course: PracticeCourse;
  source: PracticeSource;
  aiTool?: string;
  textContent?: string;
  fileName?: string;
  hasFile: boolean;
  uploadedById: string;
  uploadedByName: string;
  createdAt: string;
};

const courseLabel: Record<PracticeCourse, string> = {
  math1: "Math 1",
  math2: "Math 2",
  both: "Math 1 & 2",
};

const sourceLabel: Record<PracticeSource, string> = {
  ai: "AI generated",
  teacher: "Teacher",
  student: "Student made",
  other: "Other",
};

export function PracticeTestsPanel({
  currentUserId,
  isAdmin,
}: {
  currentUserId: string;
  isAdmin: boolean;
}) {
  const [tests, setTests] = useState<PracticeTest[] | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState<PracticeCourse>("both");
  const [source, setSource] = useState<PracticeSource>("ai");
  const [aiTool, setAiTool] = useState("");
  const [textContent, setTextContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { status: sessionStatus } = useSession();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function load() {
    const response = await fetch("/api/practice-tests");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to load");
    setTests(Array.isArray(data.tests) ? data.tests : []);
  }

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (sessionStatus !== "authenticated") {
      setTests([]);
      return;
    }
    void load().catch((err) => {
      setTests([]);
      setError(err instanceof Error ? err.message : "Could not load tests");
    });
  }, [sessionStatus]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const form = new FormData();
      form.set("title", title);
      form.set("description", description);
      form.set("course", course);
      form.set("source", source);
      if (aiTool.trim()) form.set("aiTool", aiTool.trim());
      if (textContent.trim()) form.set("textContent", textContent.trim());
      if (file) form.set("file", file);

      const response = await fetch("/api/practice-tests", {
        method: "POST",
        body: form,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");

      setTitle("");
      setDescription("");
      setCourse("both");
      setSource("ai");
      setAiTool("");
      setTextContent("");
      setFile(null);
      setTests((prev) => [data.test, ...(prev || [])]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    const response = await fetch(`/api/practice-tests/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Could not delete");
      return;
    }
    setTests((prev) => (prev || []).filter((test) => test.id !== id));
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,24rem)_1fr]">
      <form
        onSubmit={(event) => void onSubmit(event)}
        className="h-fit rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow)] sm:p-6"
      >
        <h2 className="font-[family-name:var(--font-fraunces)] text-xl text-ink">
          Upload a practice test
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Drop in AI-generated quizzes, review packets, or your own drills for
          the class.
        </p>

        <label className="mt-4 block text-sm font-medium text-ink">
          Title
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper/40 px-3 py-2.5 outline-none ring-accent focus:ring-2"
            placeholder="Linear equations practice set"
          />
        </label>

        <label className="mt-3 block text-sm font-medium text-ink">
          Course
          <select
            value={course}
            onChange={(event) =>
              setCourse(event.target.value as PracticeCourse)
            }
            className="mt-1.5 w-full rounded-xl border border-line bg-paper/40 px-3 py-2.5 outline-none ring-accent focus:ring-2"
          >
            <option value="both">Math 1 & 2</option>
            <option value="math1">Math 1</option>
            <option value="math2">Math 2</option>
          </select>
        </label>

        <label className="mt-3 block text-sm font-medium text-ink">
          Source
          <select
            value={source}
            onChange={(event) =>
              setSource(event.target.value as PracticeSource)
            }
            className="mt-1.5 w-full rounded-xl border border-line bg-paper/40 px-3 py-2.5 outline-none ring-accent focus:ring-2"
          >
            <option value="ai">AI generated</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student made</option>
            <option value="other">Other</option>
          </select>
        </label>

        {source === "ai" && (
          <label className="mt-3 block text-sm font-medium text-ink">
            AI tool (optional)
            <input
              value={aiTool}
              onChange={(event) => setAiTool(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-line bg-paper/40 px-3 py-2.5 outline-none ring-accent focus:ring-2"
              placeholder="ChatGPT, Claude, Gemini…"
            />
          </label>
        )}

        <label className="mt-3 block text-sm font-medium text-ink">
          Short description
          <textarea
            rows={2}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper/40 px-3 py-2.5 outline-none ring-accent focus:ring-2"
            placeholder="What topics does this cover?"
          />
        </label>

        <label className="mt-3 block text-sm font-medium text-ink">
          Paste test content
          <textarea
            rows={6}
            value={textContent}
            onChange={(event) => setTextContent(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper/40 px-3 py-2.5 font-mono text-xs outline-none ring-accent focus:ring-2"
            placeholder="Paste problems from an AI chat or notes…"
          />
        </label>

        <label className="mt-3 block text-sm font-medium text-ink">
          Or upload a file
          <input
            type="file"
            accept=".pdf,.txt,.md,.doc,.docx,application/pdf,text/plain,text/markdown"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            className="mt-1.5 block w-full text-sm text-ink-soft file:mr-3 file:rounded-lg file:border-0 file:bg-accent-soft file:px-3 file:py-2 file:text-accent-deep"
          />
        </label>

        {error && <p className="mt-3 text-sm text-warn">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-deep disabled:opacity-60"
        >
          {loading ? "Uploading…" : "Share practice test"}
        </button>
      </form>

      <div className="space-y-4">
        {tests === null && (
          <p className="text-sm text-ink-soft">Loading practice tests…</p>
        )}
        {tests?.length === 0 && (
          <p className="rounded-2xl border border-dashed border-line bg-surface/70 p-6 text-ink-soft">
            No practice tests yet. Upload an AI-generated set or paste one in.
          </p>
        )}
        {tests?.map((test) => {
          const open = expandedId === test.id;
          return (
            <article
              key={test.id}
              className="rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow)] sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
                    {courseLabel[test.course]} · {sourceLabel[test.source]}
                    {test.aiTool ? ` · ${test.aiTool}` : ""}
                  </p>
                  <h3 className="mt-1 font-[family-name:var(--font-fraunces)] text-2xl text-ink">
                    {test.title}
                  </h3>
                  {test.description && (
                    <p className="mt-2 text-sm text-ink-soft">
                      {test.description}
                    </p>
                  )}
                </div>
                {(test.uploadedById === currentUserId || isAdmin) && (
                  <button
                    type="button"
                    onClick={() => void remove(test.id)}
                    className="rounded-lg border border-line px-2.5 py-1 text-xs text-ink-soft hover:bg-paper-deep"
                  >
                    Delete
                  </button>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {test.hasFile && (
                  <a
                    href={`/api/practice-tests/${test.id}/file`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-accent px-3 py-1.5 text-sm text-white hover:bg-accent-deep"
                  >
                    Open file{test.fileName ? ` (${test.fileName})` : ""}
                  </a>
                )}
                {test.textContent && (
                  <button
                    type="button"
                    onClick={() => setExpandedId(open ? null : test.id)}
                    className="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-paper-deep"
                  >
                    {open ? "Hide text" : "View pasted text"}
                  </button>
                )}
              </div>

              {open && test.textContent && (
                <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-xl border border-line bg-paper/50 p-4 text-xs text-ink">
                  {test.textContent}
                </pre>
              )}

              <p className="mt-4 text-xs text-ink-soft">
                Uploaded by {test.uploadedByName} ·{" "}
                {new Date(test.createdAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
