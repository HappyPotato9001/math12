"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Problem } from "@/lib/types";
import { readClassSession } from "@/lib/session";

type ShareWorkPanelProps = {
  topicKey: string;
  topicTitle: string;
  topicPath: string;
  problem: Problem;
  answer: string;
  workDefault: string;
  isCorrect: boolean;
};

export function ShareWorkPanel({
  topicTitle,
  topicPath,
  problem,
  answer,
  workDefault,
  isCorrect,
}: ShareWorkPanelProps) {
  const [workText, setWorkText] = useState(workDefault);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const [sessionCode, setSessionCode] = useState<string | null>(null);

  useEffect(() => {
    const session = readClassSession();
    setSessionCode(session?.roomCode ?? null);
    setWorkText(workDefault);
    setStatus("idle");
    setMessage("");
  }, [workDefault, problem.id]);

  async function share() {
    const session = readClassSession();
    if (!session) {
      setStatus("error");
      setMessage("Join a class room first, then share from practice.");
      return;
    }
    setStatus("saving");
    try {
      const response = await fetch(`/api/rooms/${session.roomCode}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: session.memberId,
          topicPath,
          topicTitle,
          problemId: problem.id,
          problemPrompt: problem.prompt,
          workText,
          answer,
          isCorrect,
        }),
      });
      if (!response.ok) {
        throw new Error("Share failed");
      }
      const data = (await response.json()) as { id: string };
      setStatus("done");
      setMessage(`Shared to ${session.roomCode}.`);
      setSessionCode(session.roomCode);
      void data;
    } catch {
      setStatus("error");
      setMessage("Could not share right now. Try again.");
    }
  }

  return (
    <div className="animate-rise rounded-2xl border border-dashed border-accent/40 bg-accent-soft/40 p-5">
      <h3 className="font-[family-name:var(--font-fraunces)] text-xl text-ink">
        Share my work
      </h3>
      <p className="mt-1 text-sm text-ink-soft">
        Post this attempt to your class room so classmates can leave hints.
      </p>
      <textarea
        value={workText}
        onChange={(event) => setWorkText(event.target.value)}
        rows={3}
        className="mt-3 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none ring-accent focus:ring-2"
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={share}
          disabled={status === "saving"}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-deep disabled:opacity-60"
        >
          {status === "saving" ? "Sharing…" : "Share with class"}
        </button>
        {!sessionCode && (
          <Link href="/class" className="text-sm text-accent underline">
            Join a class room
          </Link>
        )}
        {sessionCode && (
          <Link
            href={`/class/${sessionCode}`}
            className="text-sm text-accent underline"
          >
            Open {sessionCode}
          </Link>
        )}
      </div>
      {message && (
        <p
          className={`mt-2 text-sm ${
            status === "error" ? "text-warn" : "text-ok"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
