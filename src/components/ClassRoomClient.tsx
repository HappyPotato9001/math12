"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createRoom, importRoomData, joinRoom } from "@/lib/db";
import { writeClassSession } from "@/lib/session";

export function ClassRoomClient() {
  const router = useRouter();
  const [mode, setMode] = useState<"join" | "create" | "import">("join");
  const [displayName, setDisplayName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [code, setCode] = useState("");
  const [importText, setImportText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("math12-display-name");
    if (saved) setDisplayName(saved);
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      window.localStorage.setItem("math12-display-name", displayName.trim());

      if (mode === "import") {
        const payload = JSON.parse(importText);
        const ok = importRoomData(payload);
        if (!ok || !payload.room) {
          throw new Error("Invalid room data.");
        }
        const joined = joinRoom(payload.room.code, displayName);
        if (!joined) throw new Error("Could not join imported room.");
        writeClassSession({
          roomCode: joined.room.code,
          roomName: joined.room.name,
          memberId: joined.member.id,
          displayName: joined.member.displayName,
        });
        router.push(`/class/room/?code=${joined.room.code}`);
        return;
      }

      const result =
        mode === "create"
          ? createRoom(roomName, displayName)
          : joinRoom(code, displayName);

      if (!result) {
        throw new Error("Could not join that room code.");
      }

      writeClassSession({
        roomCode: result.room.code,
        roomName: result.room.name,
        memberId: result.member.id,
        displayName: result.member.displayName,
      });
      router.push(`/class/room/?code=${result.room.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="animate-rise rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow)] sm:p-8"
    >
      <div className="flex flex-wrap gap-1 rounded-xl bg-paper-deep p-1 text-sm">
        {(
          [
            ["join", "Join with code"],
            ["create", "Create room"],
            ["import", "Import"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={`flex-1 rounded-lg px-3 py-2 ${
              mode === value ? "bg-surface text-ink shadow-sm" : "text-ink-soft"
            }`}
          >
            {label}
          </button>
        ))}
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

      {mode === "join" && (
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
      )}

      {mode === "create" && (
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

      {mode === "import" && (
        <label className="mt-4 block text-sm font-medium text-ink">
          Paste exported room JSON
          <textarea
            required
            value={importText}
            onChange={(event) => setImportText(event.target.value)}
            rows={5}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper/40 px-3 py-2.5 font-mono text-xs outline-none ring-accent focus:ring-2"
            placeholder='{"room":{...},"posts":[...]}'
          />
        </label>
      )}

      <p className="mt-3 text-xs text-ink-soft">
        Rooms are saved in this browser for GitHub Pages. Use Export/Import to
        move a room between devices.
      </p>

      {error && <p className="mt-3 text-sm text-warn">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-xl bg-accent px-4 py-3 text-sm font-medium text-white transition hover:bg-accent-deep disabled:opacity-60"
      >
        {loading
          ? "Working…"
          : mode === "join"
            ? "Join room"
            : mode === "create"
              ? "Create room"
              : "Import room"}
      </button>
    </form>
  );
}
