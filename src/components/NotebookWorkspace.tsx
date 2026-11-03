"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useEffect } from "react";

export type NotebookSource = {
  id: string;
  course: string;
  title: string;
  unit: string;
  href: string;
  summary: string;
  excerpt: string;
};

const notesKey = "math12:notebook:notes";

function words(value: string) {
  return new Set(value.toLowerCase().match(/[a-z0-9]{3,}/g) || []);
}

export function NotebookWorkspace({ sources }: { sources: NotebookSource[] }) {
  const [query, setQuery] = useState("");
  const [question, setQuestion] = useState("");
  const [selectedIds, setSelectedIds] = useState(() => sources.slice(0, 3).map((source) => source.id));
  const [answer, setAnswer] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [testTitle, setTestTitle] = useState("");
  const [testCount, setTestCount] = useState("8");
  const [testDifficulty, setTestDifficulty] = useState("mixed");
  const [testFormat, setTestFormat] = useState("mixed");
  const [includeAnswers, setIncludeAnswers] = useState(true);
  const [generatedTest, setGeneratedTest] = useState("");
  const [testStatus, setTestStatus] = useState("");
  const [testError, setTestError] = useState("");
  const [savingTest, setSavingTest] = useState(false);
  const [copiedTest, setCopiedTest] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(notesKey);
    if (!stored) return;
    const timer = window.setTimeout(() => setNotes(stored), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredSources = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return sources;
    return sources.filter((source) =>
      [source.course, source.title, source.unit, source.summary]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [query, sources]);

  const selectedSources = sources.filter((source) => selectedIds.includes(source.id));

  function toggleSource(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((sourceId) => sourceId !== id)
        : [...current, id],
    );
    setAnswer("");
    setGeneratedTest("");
    setTestStatus("");
  }

  function askQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const asked = question.trim();
    if (!asked || selectedSources.length === 0) return;
    const questionWords = words(asked);
    const ranked = selectedSources
      .map((source) => {
        const text = `${source.title} ${source.summary} ${source.excerpt}`;
        const score = [...questionWords].filter((word) => text.toLowerCase().includes(word)).length;
        return { source, score };
      })
      .sort((a, b) => b.score - a.score);
    const useful = ranked.filter((item) => item.score > 0).slice(0, 3);
    const matches = useful.length ? useful : ranked.slice(0, 2);
    setAnswer(
      matches
        .map(
          ({ source }) =>
            `${source.title}: ${source.summary} ${source.excerpt ? `Source note: ${source.excerpt}` : ""}`,
        )
        .join("\n\n"),
    );
  }

  function saveNotes() {
    window.localStorage.setItem(notesKey, notes);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  function generatePracticeTest() {
    setTestError("");
    setTestStatus("");
    if (!selectedSources.length) {
      setTestError("Select at least one lesson source first.");
      return;
    }

    const count = Math.min(20, Math.max(3, Number(testCount) || 8));
    const questions = Array.from({ length: count }, (_, index) => {
      const source = selectedSources[index % selectedSources.length];
      const focus = source.summary || source.excerpt || "the key ideas from this lesson";
      const format = testFormat === "mixed"
        ? ["multiple choice", "short answer", "show your work"][index % 3]
        : testFormat;
      const prompt =
        format === "multiple choice"
          ? `Which statement best demonstrates ${source.title}? A) A related but incorrect idea  B) A correct application  C) An unrelated rule  D) A common misconception`
          : format === "short answer"
            ? `Explain the main idea of ${source.title} in your own words.`
            : `Solve a ${testDifficulty} problem using the ideas from ${source.title}. Show your reasoning.`;
      return `${index + 1}. [${format}; ${testDifficulty}] ${prompt}\n   Source focus: ${focus}`;
    });

    setGeneratedTest(
      `${testTitle.trim() || "Practice Test"}\n\n${questions.join("\n\n")}${
        includeAnswers
          ? "\n\nAnswer key / review:\nUse the source focus under each question to check that your explanation and reasoning connect back to the selected lesson."
          : ""
      }`,
    );
    setTestTitle(
      testTitle.trim() ||
        `${selectedSources[0].title} practice test`,
    );
  }

  async function copyPracticeTest() {
    if (!generatedTest) return;
    try {
      await navigator.clipboard.writeText(generatedTest);
      setCopiedTest(true);
      window.setTimeout(() => setCopiedTest(false), 1800);
    } catch {
      setTestError("Copy is unavailable in this browser. Select the test text and copy it manually.");
    }
  }

  async function savePracticeTest() {
    if (!generatedTest.trim() || !testTitle.trim()) {
      setTestError("Generate a test and give it a title first.");
      return;
    }
    setSavingTest(true);
    setTestError("");
    setTestStatus("");
    try {
      const courseIds = new Set(
        selectedSources.map((source) => source.id.split("/")[0]),
      );
      const course =
        courseIds.size === 1
          ? courseIds.has("math1")
            ? "math1"
            : "math2"
          : "both";
      const response = await fetch("/api/practice-tests", {
        method: "POST",
        body: (() => {
          const form = new FormData();
          form.set("title", testTitle.trim());
          form.set(
            "description",
            `Generated from ${selectedSources.length} selected Notebook lesson${selectedSources.length === 1 ? "" : "s"}.`,
          );
          form.set("course", course);
          form.set("source", "ai");
          form.set("aiTool", "Notebook");
          form.set("textContent", generatedTest.trim());
          return form;
        })(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save practice test.");
      setTestStatus("Saved to your practice-test library.");
    } catch (error) {
      setTestError(error instanceof Error ? error.message : "Could not save practice test.");
    } finally {
      setSavingTest(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[90rem] px-4 py-6 sm:px-6 sm:py-10">
      <div className="border-b border-line pb-6">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">Notebook</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-[family-name:var(--font-fraunces)] text-4xl tracking-tight text-ink sm:text-5xl">
              Think with your lessons.
            </h1>
            <p className="mt-3 max-w-2xl text-ink-soft">
              Choose lesson sources, ask a focused question, and keep your own study notes in one place.
            </p>
          </div>
          <span className="rounded-full border border-accent/25 bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent-deep">
            {selectedSources.length} sources selected
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)_20rem]">
        <aside className="min-w-0 border-b border-line pb-6 lg:border-b-0 lg:border-r lg:pr-6">
          <label className="text-sm font-medium text-ink" htmlFor="source-search">Sources</label>
          <input
            id="source-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search lessons"
            className="mt-2 w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm outline-none ring-accent focus:ring-2"
          />
          <div className="mt-4 max-h-[34rem] space-y-2 overflow-y-auto pr-1">
            {filteredSources.map((source) => {
              const selected = selectedIds.includes(source.id);
              return (
                <button
                  key={source.id}
                  type="button"
                  onClick={() => toggleSource(source.id)}
                  className={`w-full rounded-xl border p-3 text-left transition ${selected ? "border-accent/45 bg-accent-soft" : "border-line bg-surface hover:border-accent/30"}`}
                >
                  <span className="text-[0.68rem] font-medium uppercase tracking-[0.12em] text-accent">{source.course}</span>
                  <span className="mt-1 block text-sm font-medium text-ink">{source.title}</span>
                  <span className="mt-1 block text-xs text-ink-soft">{source.unit}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="min-w-0">
          <section className="border-b border-line pb-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">Source-grounded guide</p>
                <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl text-ink">Ask your notebook</h2>
              </div>
              <span className="text-xs text-ink-soft">{selectedSources.length ? "Ready" : "Select a source"}</span>
            </div>
            <form onSubmit={askQuestion} className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="How are linear and exponential growth different?"
                className="min-w-0 flex-1 rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none ring-accent focus:ring-2"
              />
              <button type="submit" disabled={!question.trim() || !selectedSources.length} className="rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-50">
                Ask sources
              </button>
            </form>
            <div className="mt-5 min-h-48 rounded-2xl border border-line bg-surface p-5">
              {answer ? (
                <div className="whitespace-pre-line text-sm leading-7 text-ink">{answer}</div>
              ) : (
                <p className="text-sm leading-6 text-ink-soft">Your answer will be assembled from the selected lesson summaries and source text.</p>
              )}
            </div>
          </section>

          <section className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">Scratchpad</p>
                <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl text-ink">Keep the thread</h2>
              </div>
              <button type="button" onClick={saveNotes} className="rounded-lg border border-line px-3 py-2 text-sm text-ink-soft transition hover:bg-paper-deep hover:text-ink">
                {saved ? "Saved" : "Save notes"}
              </button>
            </div>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Capture a connection, a question, or the next step..."
              className="mt-4 min-h-56 w-full resize-y rounded-2xl border border-line bg-surface p-4 text-sm leading-6 text-ink outline-none ring-accent focus:ring-2"
            />
          </section>

          <section className="mt-8 rounded-3xl border border-accent/20 bg-gradient-to-br from-accent-soft/70 via-surface to-paper-deep/40 p-5 shadow-[var(--shadow)] sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">Notebook LM</p>
                <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl text-ink">
                  Make a practice test
                </h2>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  Turn the selected lessons into a review test, then save it for later.
                </p>
              </div>
              <span className="rounded-full border border-accent/20 bg-surface/80 px-3 py-1.5 text-xs font-medium text-accent-deep">
                {selectedSources.length} lesson{selectedSources.length === 1 ? "" : "s"} in context
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_8rem_11rem_11rem]">
              <input
                value={testTitle}
                onChange={(event) => setTestTitle(event.target.value)}
                placeholder="Practice test title"
                className="rounded-xl border border-line bg-surface px-3 py-2.5 text-sm outline-none ring-accent focus:ring-2"
              />
              <label className="text-sm text-ink-soft">
                Questions
                <input
                  type="number"
                  min={3}
                  max={20}
                  value={testCount}
                  onChange={(event) => setTestCount(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none ring-accent focus:ring-2"
                />
              </label>
              <label className="text-sm text-ink-soft">
                Difficulty
                <select
                  value={testDifficulty}
                  onChange={(event) => setTestDifficulty(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none ring-accent focus:ring-2"
                >
                  <option value="mixed">Mixed</option>
                  <option value="foundations">Foundations</option>
                  <option value="challenge">Challenge</option>
                </select>
              </label>
              <label className="text-sm text-ink-soft">
                Question style
                <select
                  value={testFormat}
                  onChange={(event) => setTestFormat(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none ring-accent focus:ring-2"
                >
                  <option value="mixed">Mixed</option>
                  <option value="multiple choice">Multiple choice</option>
                  <option value="short answer">Short answer</option>
                  <option value="show your work">Show your work</option>
                </select>
              </label>
            </div>
            <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={includeAnswers}
                onChange={(event) => setIncludeAnswers(event.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              Include source-based answer guidance
            </label>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={generatePracticeTest}
                disabled={!selectedSources.length}
                className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-50"
              >
                Generate from sources
              </button>
              {generatedTest && (
                <button
                  type="button"
                  onClick={() => void savePracticeTest()}
                  disabled={savingTest}
                  className="rounded-xl border border-accent/30 px-4 py-2.5 text-sm font-medium text-accent transition hover:bg-accent-soft disabled:opacity-50"
                >
                  {savingTest ? "Saving…" : "Save practice test"}
                </button>
              )}
              {generatedTest && (
                <button
                  type="button"
                  onClick={() => void copyPracticeTest()}
                  className="rounded-xl border border-line bg-surface/80 px-4 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-surface hover:text-ink"
                >
                  {copiedTest ? "Copied" : "Copy test"}
                </button>
              )}
            </div>
            {generatedTest && (
              <textarea
                value={generatedTest}
                onChange={(event) => setGeneratedTest(event.target.value)}
                className="mt-4 min-h-72 w-full rounded-2xl border border-line bg-surface p-4 font-mono text-xs leading-6 text-ink outline-none ring-accent focus:ring-2"
                aria-label="Generated practice test"
              />
            )}
            {testStatus && <p className="mt-3 text-sm text-accent-deep">{testStatus}</p>}
            {testError && <p className="mt-3 text-sm text-warn">{testError}</p>}
            <Link
              href="/practice-tests"
              className="mt-3 inline-block text-sm font-medium text-accent underline"
            >
              Open practice-test library
            </Link>
          </section>
        </main>

        <aside className="min-w-0 border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-6">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">Selected sources</p>
          <div className="mt-4 space-y-3">
            {selectedSources.length ? selectedSources.map((source) => (
              <div key={source.id} className="border-b border-line pb-3 last:border-0">
                <p className="text-sm font-medium text-ink">{source.title}</p>
                <p className="mt-1 text-xs leading-5 text-ink-soft">{source.summary}</p>
                <Link href={source.href} className="mt-2 inline-block text-xs font-medium text-accent underline">Open lesson</Link>
              </div>
            )) : <p className="text-sm text-ink-soft">Select lessons from the source list to start.</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}