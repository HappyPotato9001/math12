"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readClassSession, type ClassSession } from "@/lib/session";

export function ClassSessionBadge() {
  const [session, setSession] = useState<ClassSession | null>(null);

  useEffect(() => {
    setSession(readClassSession());
    const onFocus = () => setSession(readClassSession());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  if (!session) return null;

  return (
    <Link
      href={`/class/room/?code=${session.roomCode}`}
      className="hidden rounded-full border border-accent/30 bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent-deep md:inline-flex"
      title={`Signed into ${session.roomName} as ${session.displayName}`}
    >
      {session.roomCode}
    </Link>
  );
}
