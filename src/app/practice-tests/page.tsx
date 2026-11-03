import { redirect } from "next/navigation";
import { PracticeTestsPanel } from "@/components/PracticeTestsPanel";
import { StaticFeatureNotice } from "@/components/StaticFeatureNotice";
import { isStaticExport } from "@/lib/runtime";
import { getSessionUser } from "@/lib/server/session";

export default async function PracticeTestsPage() {
  if (isStaticExport()) {
    return (
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:py-14">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
            Practice tests
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-4xl tracking-tight text-ink sm:text-5xl">
            Extra drills for class
          </h1>
        </div>
        <StaticFeatureNotice
          title="Practice-test uploads need the live server"
          description="GitHub Pages serves lessons and built-in classwork. Run the app locally to upload and share practice-test files."
        />
      </div>
    );
  }

  const user = await getSessionUser();
  if (!user) redirect("/login?next=/practice-tests");
  if (user.status !== "approved") redirect("/pending");

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:py-14">
      <div className="max-w-2xl">
        <p className="animate-rise text-sm font-medium uppercase tracking-[0.18em] text-accent">
          Practice tests
        </p>
        <span
          className="animate-draw delay-1 mt-3 block h-[2px] w-14 bg-accent"
          aria-hidden
        />
        <h1 className="animate-rise delay-1 mt-4 font-[family-name:var(--font-fraunces)] text-4xl tracking-tight text-ink sm:text-5xl">
          Extra drills for class
        </h1>
        <p className="animate-rise delay-2 mt-3 text-lg text-ink-soft">
          Upload AI-generated practice tests, review packets, or your own
          problem sets so the whole class can use them.
        </p>
      </div>
      <PracticeTestsPanel
        currentUserId={user.id}
        isAdmin={user.role === "admin"}
      />
    </div>
  );
}
