"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  status: "pending" | "approved" | "rejected";
};

export function AuthButtons() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => {
    void fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  if (user === undefined) {
    return <div className="h-9 w-24 rounded-md bg-paper-deep/60" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-1">
        <Link
          href="/login"
          className="rounded-md px-2.5 py-2 text-ink-soft transition hover:bg-paper-deep hover:text-ink sm:px-3"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="rounded-md bg-accent px-2.5 py-2 text-white transition hover:bg-accent-deep sm:px-3"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {user.role === "admin" && user.status === "approved" && (
        <Link
          href="/admin"
          className="rounded-md px-2.5 py-2 text-ink-soft transition hover:bg-paper-deep hover:text-ink sm:px-3"
        >
          Admin
        </Link>
      )}
      <span className="hidden max-w-[9rem] truncate text-xs text-ink-soft sm:inline">
        {user.name}
      </span>
      <button
        type="button"
        onClick={() => void logout()}
        className="rounded-md px-2.5 py-2 text-ink-soft transition hover:bg-paper-deep hover:text-ink sm:px-3"
      >
        Sign out
      </button>
    </div>
  );
}
