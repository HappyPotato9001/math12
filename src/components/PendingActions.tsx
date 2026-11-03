"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function PendingActions() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkApproval() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/refresh", { method: "POST" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not refresh");
      }
      if (data.user.status === "approved") {
        router.push("/math1");
        router.refresh();
        return;
      }
      setMessage(`Still ${data.user.status}. Ask an admin to accept you.`);
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not refresh");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
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
          onClick={() => void logout()}
          className="rounded-xl border border-line px-4 py-2.5 text-sm hover:bg-paper-deep"
        >
          Sign out
        </button>
      </div>
      {message && <p className="text-sm text-ink-soft">{message}</p>}
    </div>
  );
}
