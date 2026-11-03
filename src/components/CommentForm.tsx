"use client";

import { useState, type FormEvent } from "react";
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

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const session = readClassSession();
    if (!session || session.roomCode !== roomCode) {
      setError("Join this room before commenting.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `/api/rooms/${roomCode}/posts/${postId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ authorId: session.memberId, body }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not comment");
      }
      setBody("");
      onCommented?.();
      void data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not comment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="mt-4 space-y-2">
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
