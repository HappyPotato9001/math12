"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

type Props = {
  enabled: { google: boolean; github: boolean };
  nextPath?: string;
};

export function OAuthButtons({ enabled, nextPath = "/learning" }: Props) {
  const [loading, setLoading] = useState<"google" | "github" | null>(null);
  const redirectTo = nextPath.startsWith("/") ? nextPath : "/learning";

  if (!enabled.google && !enabled.github) {
    return (
      <p className="rounded-xl border border-dashed border-line bg-paper/40 px-3 py-3 text-xs text-ink-soft">
        Google / GitHub sign-in needs{" "}
        <code className="text-ink">AUTH_GOOGLE_*</code> or{" "}
        <code className="text-ink">AUTH_GITHUB_*</code> in your env file.
      </p>
    );
  }

  async function start(provider: "google" | "github") {
    setLoading(provider);
    await signIn(provider, { redirectTo });
  }

  return (
    <div className="flex flex-col gap-2">
      {enabled.google && (
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => void start("google")}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-paper/40 px-4 py-3 text-sm font-medium text-ink transition hover:bg-paper-deep disabled:opacity-60"
        >
          <GoogleIcon />
          {loading === "google" ? "Opening Google…" : "Continue with Google"}
        </button>
      )}
      {enabled.github && (
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => void start("github")}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-paper/40 px-4 py-3 text-sm font-medium text-ink transition hover:bg-paper-deep disabled:opacity-60"
        >
          <GitHubIcon />
          {loading === "github" ? "Opening GitHub…" : "Continue with GitHub"}
        </button>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.3 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.7-6.5 7.1l.1.1 6.3 5.2C37.2 38.3 44 33 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.28-.01-1.03-.02-2.02-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.21.7.82.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
    </svg>
  );
}
