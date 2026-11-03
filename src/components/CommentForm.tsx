"use client";

import { useState, type FormEvent } from "react";
import { createComment } from "@/lib/db";
import { readClassSession } from "@/lib/session";

export function CommentForm({
  roomCode,
  postId,
  onCommented,
}: {
  roomCode: string;
  postId: string;
  onCommented?: () => void;
}) {
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const session = readClassSession();
    if (!session || session.roomCode !== roomCode) {
      setError("Join this room before commenting.");
      return;
    }
    setLoading(true);
    const comment = createComment({
      roomCode,
      postId,
      authorId: session.memberId,
      body,
    });
    if (!comment) {
      setError("Could not add comment.");
      setLoading(false);
      return;
    }
    setBody("");
    setLoading(false);
    onCommented?.();
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-2">
      <textarea
        required
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={3}
        placeholder="Leave a hint or correction…"
        className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none ring-accent focus:ring-2"
      />
      {error && <p className="text-sm text-warn">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-deep disabled:opacity-60"
      >
        {loading ? "Posting…" : "Add comment"}
      </button>
    </form>
  );
}
