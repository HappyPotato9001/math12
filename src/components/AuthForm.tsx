"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/math1";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(
        mode === "signup" ? "/api/auth/signup" : "/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            mode === "signup"
              ? { name, email, password }
              : { email, password },
          ),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }
      if (data.user.status !== "approved") {
        router.push("/pending");
        router.refresh();
        return;
      }
      router.push(nextPath.startsWith("/") ? nextPath : "/math1");
      router.refresh();
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
      <h1 className="font-[family-name:var(--font-fraunces)] text-3xl tracking-tight text-ink">
        {mode === "signup" ? "Create an account" : "Sign in"}
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        {mode === "signup"
          ? "After you sign up, an admin must approve you before Math 1/2 unlocks."
          : "Approved accounts can open lessons and classwork."}
      </p>

      {mode === "signup" && (
        <label className="mt-5 block text-sm font-medium text-ink">
          Name
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper/40 px-3 py-2.5 outline-none ring-accent focus:ring-2"
            placeholder="Alex"
          />
        </label>
      )}

      <label className="mt-4 block text-sm font-medium text-ink">
        Email
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-line bg-paper/40 px-3 py-2.5 outline-none ring-accent focus:ring-2"
          placeholder="you@school.edu"
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-ink">
        Password
        <input
          required
          type="password"
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-line bg-paper/40 px-3 py-2.5 outline-none ring-accent focus:ring-2"
          placeholder="At least 6 characters"
        />
      </label>

      {error && <p className="mt-3 text-sm text-warn">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-xl bg-accent px-4 py-3 text-sm font-medium text-white transition hover:bg-accent-deep disabled:opacity-60"
      >
        {loading
          ? "Working…"
          : mode === "signup"
            ? "Sign up"
            : "Sign in"}
      </button>

      <p className="mt-4 text-sm text-ink-soft">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-accent underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            Need an account?{" "}
            <Link href="/signup" className="text-accent underline">
              Sign up
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
