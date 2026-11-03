"use client";

import { useRef, useState, type FormEvent } from "react";
import { compressImageFile, uploadImageDataUrl } from "@/lib/compressImage";
import { readClassSession } from "@/lib/session";

export function PhotoWorkForm({
  roomCode,
  onPosted,
}: {
  roomCode: string;
  onPosted: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onPickImage(file: File | null) {
    if (!file) {
      setPreview(null);
      return;
    }
    try {
      setPreview(await compressImageFile(file));
      setError("");
    } catch (err) {
      setPreview(null);
      setError(err instanceof Error ? err.message : "Could not use that photo.");
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const session = readClassSession();
    if (!session || session.roomCode !== roomCode) {
      setError("Join this room before posting a photo.");
      return;
    }
    if (!preview) {
      setError("Add a photo of your work.");
      return;
    }
    setLoading(true);
    try {
      const imageId = await uploadImageDataUrl(preview);
      const response = await fetch(`/api/rooms/${roomCode}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: session.memberId,
          topicPath: "/class",
          topicTitle: title.trim() || "Photo of my work",
          problemId: `photo-${imageId}`,
          problemPrompt: title.trim() || "Photo of handwritten / worksheet work",
          workText: note.trim() || "Shared a photo of my work.",
          answer: "",
          isCorrect: false,
          imageId,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not create post.");
      }
      setTitle("");
      setNote("");
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      onPosted();
      void data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post photo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      className="rounded-2xl border border-dashed border-accent/40 bg-accent-soft/30 p-5"
    >
      <h2 className="font-[family-name:var(--font-fraunces)] text-xl text-ink">
        Post a photo of your work
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        Photos upload to the server so everyone in the room can open them.
      </p>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What topic is this? (optional)"
        className="mt-3 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none ring-accent focus:ring-2"
      />
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        rows={2}
        placeholder="What do you want help with?"
        className="mt-2 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none ring-accent focus:ring-2"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <label className="cursor-pointer rounded-xl border border-line bg-surface px-4 py-2 text-sm hover:bg-paper-deep">
          {preview ? "Change photo" : "Choose / take photo"}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(event) => void onPickImage(event.target.files?.[0] ?? null)}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-deep disabled:opacity-60"
        >
          {loading ? "Posting…" : "Post photo"}
        </button>
      </div>
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Preview of your work"
          className="mt-3 max-h-56 w-full rounded-xl border border-line object-contain bg-paper"
        />
      )}
      {error && <p className="mt-2 text-sm text-warn">{error}</p>}
    </form>
  );
}
