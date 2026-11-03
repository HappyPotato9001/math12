import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { oauthProvidersEnabled } from "@/lib/oauth";

export default function LoginPage() {
  const oauth = oauthProvidersEnabled();
  return (
    <div className="mx-auto w-full max-w-md px-5 py-10 sm:py-14">
      <Suspense fallback={<div className="text-ink-soft">Loading…</div>}>
        <AuthForm mode="login" oauth={oauth} />
      </Suspense>
    </div>
  );
}
