"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Problem } from "@/lib/types";
import { answersMatch } from "@/lib/answers";
import { accuracyPercent, readTopicProgress, recordAttempt } from "@/lib/progress";
import { MathText } from "./MathText";

type PracticeDrillProps = {
  topicKey: string;
  lessonHref: string;
  problems: Problem[];
};

type FeedbackState = {
  correct: boolean;
  explanation: string;
} | null;

export function PracticeDrill({
  topicKey,
  lessonHref,
  problems,
}: PracticeDrillProps) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [revealed, setRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [progress, setProgress] = useState(() => readTopicProgress(topicKey));

  const problem = problems[index];
  const answerValue = useMemo(() => {
    if (!problem) return "";
    if (problem.type === "multiple-choice") return selected ?? "";
    return input;
  }, [input, problem, selected]);

  if (!problem) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 shadow-[var(--shadow)]">
        <p className="text-ink-soft">No practice problems yet for this topic.</p>
        <Link href={lessonHref} className="mt-4 inline-block text-accent underline">
          Back to lesson
        </Link>
      </div>
    );
  }

  function resetLocal() {
    setInput("");
    setSelected(null);
    setFeedback(null);
    setRevealed(false);
    setShowHint(false);
  }

  function checkAnswer() {
    if (!problem || !answerValue.trim()) return;
    const correct = answersMatch(
      answerValue,
      problem.answer,
      problem.acceptedAnswers,
    );
    const next = recordAttempt(topicKey, problem.id, correct);
    setProgress(next);
    setFeedback({
      correct,
      explanation: correct
        ? problem.explanation
        : `Not quite. ${problem.hint}`,
    });
  }

  function nextProblem() {
    resetLocal();
    setIndex((current) => (current + 1) % problems.length);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-ink-soft">
        <p>
          Problem {index + 1} of {problems.length}
        </p>
        <p>
          Accuracy {accuracyPercent(progress)}% · streak {progress.streak} · best{" "}
          {progress.bestStreak}
        </p>
      </div>

      <div className="animate-rise rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow)] sm:p-8">
        {problem.label && (
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
            {problem.label}
          </p>
        )}
        <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl tracking-tight text-ink">
          <MathText text={problem.prompt} />
        </h2>

        <div className="mt-6 space-y-3">
          {problem.type === "multiple-choice" && problem.choices ? (
            <div className="grid gap-2">
              {problem.choices.map((choice) => {
                const active = selected === choice;
                return (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => {
                      setSelected(choice);
                      setFeedback(null);
                    }}
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      active
                        ? "border-accent bg-accent-soft"
                        : "border-line bg-paper/50 hover:border-accent/50"
                    }`}
                  >
                    <MathText text={choice} />
                  </button>
                );
              })}
            </div>
          ) : (
            <input
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setFeedback(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") checkAnswer();
              }}
              placeholder="Type your answer"
              className="w-full rounded-xl border border-line bg-paper/40 px-4 py-3 outline-none ring-accent focus:ring-2"
            />
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={checkAnswer}
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-deep"
          >
            Check
          </button>
          <button
            type="button"
            onClick={() => setShowHint(true)}
            className="rounded-xl border border-line px-4 py-2.5 text-sm transition hover:bg-paper-deep"
          >
            Hint
          </button>
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="rounded-xl border border-line px-4 py-2.5 text-sm transition hover:bg-paper-deep"
          >
            Reveal solution
          </button>
          <button
            type="button"
            onClick={nextProblem}
            className="rounded-xl border border-line px-4 py-2.5 text-sm transition hover:bg-paper-deep"
          >
            Next
          </button>
          <Link
            href={lessonHref}
            className="rounded-xl border border-line px-4 py-2.5 text-sm transition hover:bg-paper-deep"
          >
            Lesson notes
          </Link>
        </div>

        {showHint && (
          <p className="mt-4 rounded-xl bg-paper-deep/80 px-4 py-3 text-sm text-ink-soft">
            <MathText text={problem.hint} />
          </p>
        )}

        {feedback && (
          <div
            className={`mt-4 rounded-xl px-4 py-3 text-sm ${
              feedback.correct
                ? "animate-ok bg-ok-soft text-ok"
                : "bg-warn-soft text-warn"
            }`}
          >
            <p className="font-medium">
              {feedback.correct ? "Correct — nice work." : "Keep going."}
            </p>
            <p className="mt-1">
              <MathText text={feedback.explanation} />
            </p>
          </div>
        )}

        {revealed && (
          <div className="mt-4 rounded-xl border border-line bg-paper/70 px-4 py-3 text-sm">
            <p className="font-medium text-ink">Solution</p>
            <p className="mt-1 text-ink-soft">
              <MathText text={problem.solution} />
            </p>
            <p className="mt-2 text-ink-soft">
              <MathText text={problem.explanation} />
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
