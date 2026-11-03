import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { StaticFeatureNotice } from "@/components/StaticFeatureNotice";
import { oauthProvidersEnabled } from "@/lib/oauth";
import { isStaticExport } from "@/lib/runtime";

export default function SignupPage() {
  if (isStaticExport()) {
    return (
      <div className="mx-auto w-full max-w-lg px-5 py-10 sm:py-14">
        <StaticFeatureNotice
          title="Sign-up needs the live server"
          description="This GitHub Pages build is open for studying. Create accounts when you run the app with Node locally or on a host that supports APIs."
        />
      </div>
    );
  }

  const oauth = oauthProvidersEnabled();
  return (
    <div className="mx-auto w-full max-w-md px-5 py-10 sm:py-14">
      <Suspense fallback={<div className="text-ink-soft">Loading…</div>}>
        <AuthForm mode="signup" oauth={oauth} />
      </Suspense>
    </div>
  );
}
