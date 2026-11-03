"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { OAuthButtons } from "@/components/OAuthButtons";

type Mode = "login" | "signup";

type Props = {
  mode: Mode;
  oauth: { google: boolean; github: boolean };
};

export function AuthForm({ mode, oauth }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";
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
      if (mode === "signup") {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Signup failed");
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        throw new Error(
          mode === "signup"
            ? "Account created, but sign-in failed. Try signing in."
            : "Invalid email or password.",
        );
      }

      const me = await fetch("/api/auth/me").then((r) => r.json());
      if (me.user?.status !== "approved") {
        router.push("/pending");
        router.refresh();
        return;
      }
      router.push(nextPath.startsWith("/") ? nextPath : "/learning");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-rise rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow)] sm:p-8">
      <h1 className="font-[family-name:var(--font-fraunces)] text-3xl tracking-tight text-ink">
        {mode === "signup" ? "Create an account" : "Sign in"}
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        {mode === "signup"
          ? "Sign up with email or Google/GitHub. An admin must approve you before Math 1/2 unlocks."
          : "Use email, Google, or GitHub. Approved accounts can open lessons and classwork."}
      </p>

      <div className="mt-5">
        <OAuthButtons enabled={oauth} nextPath={nextPath} />
      </div>

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-ink-soft">
        <span className="h-px flex-1 bg-line" />
        or email
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={(event) => void onSubmit(event)}>
        {mode === "signup" && (
          <label className="block text-sm font-medium text-ink">
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
      </form>

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
    </div>
  );
}
