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