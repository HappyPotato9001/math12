"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { nanoid } from "nanoid";
import type { Problem } from "@/lib/types";
import { createPost } from "@/lib/db";
import { compressImageFile, saveImage } from "@/lib/images";
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
  const fileRef = useRef<HTMLInputElement>(null);
  const [workText, setWorkText] = useState(workDefault);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const [sessionCode, setSessionCode] = useState<string | null>(null);

  useEffect(() => {
    const session = readClassSession();
    setSessionCode(session?.roomCode ?? null);
    setWorkText(workDefault);
    setPreview(null);
    setStatus("idle");
    setMessage("");
    if (fileRef.current) fileRef.current.value = "";
  }, [workDefault, problem.id]);

  async function onPickImage(file: File | null) {
    if (!file) {
      setPreview(null);
      return;
    }
    try {
      const dataUrl = await compressImageFile(file);
      setPreview(dataUrl);
      setMessage("");
    } catch (err) {
      setPreview(null);
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Could not use that photo.");
    }
  }

  async function share() {
    const session = readClassSession();
    if (!session) {
      setStatus("error");
      setMessage("Join a class room first, then share from practice.");
      return;
    }
    if (!workText.trim() && !preview) {
      setStatus("error");
      setMessage("Add a note or a photo of your work before sharing.");
      return;
    }
    setStatus("saving");
    try {
      let imageId: string | undefined;
      if (preview) {
        imageId = nanoid(12);
        await saveImage(imageId, preview);
      }
      const post = createPost({
        roomCode: session.roomCode,
        authorId: session.memberId,
        topicPath,
        topicTitle,
        problemId: problem.id,
        problemPrompt: problem.prompt,
        workText,
        answer,
        isCorrect,
        imageId,
      });
      if (!post) {
        throw new Error("Could not share. Re-join the class room and try again.");
      }
      setStatus("done");
      setMessage(
        preview
          ? `Shared photo + work to ${session.roomCode}.`
          : `Shared to ${session.roomCode}.`,
      );
      setSessionCode(session.roomCode);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Could not share right now.");
    }
  }

  return (
    <div className="animate-rise rounded-2xl border border-dashed border-accent/40 bg-accent-soft/40 p-5">
      <h3 className="font-[family-name:var(--font-fraunces)] text-xl text-ink">
        Share my work
      </h3>
      <p className="mt-1 text-sm text-ink-soft">
        Add a photo of your notebook or worksheet so classmates can see your
        steps.
      </p>
      <textarea
        value={workText}
        onChange={(event) => setWorkText(event.target.value)}
        rows={3}
        placeholder="Optional note about what you tried…"
        className="mt-3 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none ring-accent focus:ring-2"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="cursor-pointer rounded-xl border border-line bg-surface px-4 py-2 text-sm transition hover:bg-paper-deep">
          {preview ? "Change photo" : "Add photo"}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(event) => void onPickImage(event.target.files?.[0] ?? null)}
          />
        </label>
        {preview && (
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              if (fileRef.current) fileRef.current.value = "";
            }}
            className="rounded-xl border border-line px-3 py-2 text-sm text-ink-soft hover:bg-paper-deep"
          >
            Remove photo
          </button>
        )}
      </div>

      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Preview of your work"
          className="mt-3 max-h-56 w-full rounded-xl border border-line object-contain bg-paper"
        />
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void share()}
          disabled={status === "saving"}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-deep disabled:opacity-60"
        >
          {status === "saving" ? "Sharing…" : "Share with class"}
        </button>
        {!sessionCode && (
          <Link href="/class/" className="text-sm text-accent underline">
            Join a class room
          </Link>
        )}
        {sessionCode && (
          <Link
            href={`/class/room/?code=${sessionCode}`}
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
