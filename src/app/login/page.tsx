import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { StaticFeatureNotice } from "@/components/StaticFeatureNotice";
import { oauthProvidersEnabled } from "@/lib/oauth";
import { isStaticExport } from "@/lib/runtime";
import { getSessionUser } from "@/lib/server/session";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (isStaticExport()) {
    return (
      <div className="mx-auto w-full max-w-lg px-5 py-10 sm:py-14">
        <StaticFeatureNotice
          title="Sign-in needs the live server"
          description="On GitHub Pages you can open every Math 1/2 lesson and classwork drill without an account."
        />
      </div>
    );
  }

  const user = await getSessionUser();
  if (user) {
    const { next } = await searchParams;
    const nextPath = next?.startsWith("/") && !next.startsWith("//") ? next : "/";
    redirect(user.status === "approved" ? nextPath : "/pending");
  }

  const oauth = oauthProvidersEnabled();
  return (
    <div className="mx-auto w-full max-w-md px-5 py-10 sm:py-14">
      <Suspense fallback={<div className="text-ink-soft">Loading…</div>}>
        <AuthForm mode="login" oauth={oauth} />
      </Suspense>
    </div>
  );
}
