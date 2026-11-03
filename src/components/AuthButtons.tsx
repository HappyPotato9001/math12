"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type MeUser = {
  name?: string | null;
  role?: string;
  status?: string;
};

export function AuthButtons() {
  const { data, status } = useSession();
  const [me, setMe] = useState<MeUser | null>(null);

  useEffect(() => {
    if (status !== "authenticated") {
      setMe(null);
      return;
    }
    let cancelled = false;
    void fetch("/api/auth/me")
      .then((res) => res.json())
      .then((body) => {
        if (!cancelled) setMe(body.user ?? null);
      })
      .catch(() => {
        if (!cancelled) setMe(null);
      });
    return () => {
      cancelled = true;
    };
  }, [status, data?.user?.role, data?.user?.status]);

  if (status === "loading") {
    return <div className="h-9 w-24 rounded-md bg-paper-deep/60" />;
  }

  const user = data?.user;
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

  const role = me?.role ?? user.role;
  const userStatus = me?.status ?? user.status;
  const isAdmin = role === "admin" && userStatus === "approved";

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {isAdmin && (
        <Link
          href="/admin"
          className="rounded-md px-2.5 py-2 text-ink-soft transition hover:bg-paper-deep hover:text-ink sm:px-3"
        >
          Admin
        </Link>
      )}
      <span className="hidden max-w-[9rem] truncate text-xs text-ink-soft sm:inline">
        {me?.name ?? user.name}
      </span>
      <button
        type="button"
        onClick={() => void signOut({ callbackUrl: "/" })}
        className="rounded-md px-2.5 py-2 text-ink-soft transition hover:bg-paper-deep hover:text-ink sm:px-3"
      >
        Sign out
      </button>
    </div>
  );
}
