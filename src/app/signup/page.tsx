import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div className="mx-auto w-full max-w-md px-5 py-10 sm:py-14">
      <Suspense fallback={<div className="text-ink-soft">Loading…</div>}>
        <AuthForm mode="signup" />
      </Suspense>
    </div>
  );
}
