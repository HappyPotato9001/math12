"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { writeClassSession } from "@/lib/session";

export function ClassRoomClient() {
  const router = useRouter();
  const [mode, setMode] = useState<"join" | "create">("join");
  const [displayName, setDisplayName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("math12-display-name");
    if (saved) setDisplayName(saved);
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      window.localStorage.setItem("math12-display-name", displayName.trim());
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "create"
            ? { action: "create", name: roomName, displayName }
            : { action: "join", code, displayName },
        ),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }
      writeClassSession({
        roomCode: data.room.code,
        roomName: data.room.name,
        memberId: data.member.id,
        displayName: data.member.displayName,
      });
      router.push(`/class/room/?code=${data.room.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      className="animate-rise rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow)] sm:p-8"
    >
      <div className="flex gap-2 rounded-xl bg-paper-deep p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode("join")}
          className={`flex-1 rounded-lg px-3 py-2 ${
            mode === "join" ? "bg-surface text-ink shadow-sm" : "text-ink-soft"
          }`}
        >
          Join with code
        </button>
        <button
          type="button"
          onClick={() => setMode("create")}
          className={`flex-1 rounded-lg px-3 py-2 ${
            mode === "create" ? "bg-surface text-ink shadow-sm" : "text-ink-soft"
          }`}
        >
          Create room
        </button>
      </div>

      <label className="mt-5 block text-sm font-medium text-ink">
        Display name
        <input
          required
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-line bg-paper/40 px-3 py-2.5 outline-none ring-accent focus:ring-2"
          placeholder="Alex"
        />
      </label>

      {mode === "join" ? (
        <label className="mt-4 block text-sm font-medium text-ink">
          Class code
          <input
            required
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper/40 px-3 py-2.5 uppercase tracking-wide outline-none ring-accent focus:ring-2"
            placeholder="MATH-7K2P"
          />
        </label>
      ) : (
        <label className="mt-4 block text-sm font-medium text-ink">
          Room name
          <input
            required
            value={roomName}
            onChange={(event) => setRoomName(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper/40 px-3 py-2.5 outline-none ring-accent focus:ring-2"
            placeholder="Period 3 Math 2"
          />
        </label>
      )}

      <p className="mt-3 text-xs text-ink-soft">
        Rooms, posts, comments, and work photos are saved on the server so
        everyone in the room can see them.
      </p>

      {error && <p className="mt-3 text-sm text-warn">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-xl bg-accent px-4 py-3 text-sm font-medium text-white transition hover:bg-accent-deep disabled:opacity-60"
      >
        {loading ? "Working…" : mode === "join" ? "Join room" : "Create room"}
      </button>
    </form>
  );
}
