"use client";

import { useEffect, useMemo, useState } from "react";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

const statusOrder: Record<UserRow["status"], number> = {
  pending: 0,
  approved: 1,
  rejected: 2,
};

export function AdminUsersClient() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/admin/users");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Could not load users");
        }
        if (!cancelled) setUsers(data.users);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load users");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = useMemo(
    () =>
      [...users].sort((a, b) => {
        const byStatus = statusOrder[a.status] - statusOrder[b.status];
        if (byStatus !== 0) return byStatus;
        return b.createdAt.localeCompare(a.createdAt);
      }),
    [users],
  );

  const pendingCount = users.filter(
    (user) => user.role !== "admin" && user.status === "pending",
  ).length;

  async function setStatus(id: string, status: UserRow["status"]) {
    setError("");
    setBusyId(id);
    try {
      const response = await fetch(`/api/admin/users/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Update failed");
        return;
      }
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, status: data.user.status } : user,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return <p className="text-ink-soft">Loading accounts…</p>;
  }

  if (!users.length) {
    return <p className="text-ink-soft">No accounts yet.</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-soft">
        {pendingCount === 0
          ? "No pending requests right now."
          : `${pendingCount} pending ${pendingCount === 1 ? "request" : "requests"} — Accept unlocks Math 1/2.`}
      </p>
      {error && <p className="text-sm text-warn">{error}</p>}
      {sorted.map((user) => (
        <div
          key={user.id}
          className="rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow)] sm:p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-ink">{user.name}</p>
              <p className="text-sm text-ink-soft">{user.email}</p>
              <p className="mt-1 text-xs text-ink-soft">
                {user.role} ·{" "}
                <span className="capitalize text-ink">{user.status}</span> ·{" "}
                {new Date(user.createdAt).toLocaleString()}
              </p>
            </div>
            {user.role !== "admin" && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busyId === user.id || user.status === "approved"}
                  onClick={() => void setStatus(user.id, "approved")}
                  className="rounded-lg bg-accent px-3 py-1.5 text-sm text-white hover:bg-accent-deep disabled:opacity-50"
                >
                  {busyId === user.id
                    ? "Saving…"
                    : user.status === "approved"
                      ? "Accepted"
                      : "Accept"}
                </button>
                <button
                  type="button"
                  disabled={busyId === user.id || user.status === "pending"}
                  onClick={() => void setStatus(user.id, "pending")}
                  className="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-paper-deep disabled:opacity-50"
                >
                  Pending
                </button>
                <button
                  type="button"
                  disabled={busyId === user.id || user.status === "rejected"}
                  onClick={() => void setStatus(user.id, "rejected")}
                  className="rounded-lg border border-line px-3 py-1.5 text-sm text-warn hover:bg-warn-soft disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
