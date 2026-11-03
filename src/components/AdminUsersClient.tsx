"use client";

import { useCallback, useEffect, useState } from "react";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export function AdminUsersClient() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not load users");
      }
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  async function setStatus(id: string, status: UserRow["status"]) {
    setError("");
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
    await reload();
  }

  if (loading) {
    return <p className="text-ink-soft">Loading accounts…</p>;
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-warn">{error}</p>}
      {users.map((user) => (
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
                  onClick={() => void setStatus(user.id, "approved")}
                  className="rounded-lg bg-accent px-3 py-1.5 text-sm text-white hover:bg-accent-deep"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => void setStatus(user.id, "pending")}
                  className="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-paper-deep"
                >
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => void setStatus(user.id, "rejected")}
                  className="rounded-lg border border-line px-3 py-1.5 text-sm text-warn hover:bg-warn-soft"
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
