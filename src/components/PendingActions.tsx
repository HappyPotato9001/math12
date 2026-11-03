"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function PendingActions() {
  const router = useRouter();
  const { update } = useSession();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkApproval() {
    setLoading(true);
    setMessage("");
    try {
      const session = await update();
      const status = session?.user?.status;
      if (status === "approved") {
        router.push("/learning");
        router.refresh();
        return;
      }
      setMessage(
        status
          ? `Still ${status}. Ask an admin to accept you.`
          : "Could not refresh your status.",
      );
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not refresh");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void checkApproval()}
          disabled={loading}
          className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-deep disabled:opacity-60"
        >
          {loading ? "Checking…" : "Check approval"}
        </button>
        <button
          type="button"
          onClick={() => void signOut({ callbackUrl: "/" })}
          className="rounded-xl border border-line px-4 py-2.5 text-sm hover:bg-paper-deep"
        >
          Sign out
        </button>
      </div>
      {message && <p className="text-sm text-ink-soft">{message}</p>}
    </div>
  );
}
