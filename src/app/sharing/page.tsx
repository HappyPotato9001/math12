import { redirect } from "next/navigation";
import { SharingBoard } from "@/components/SharingBoard";
import { StaticFeatureNotice } from "@/components/StaticFeatureNotice";
import { isStaticExport } from "@/lib/runtime";
import { getSessionUser } from "@/lib/server/session";

export default async function SharingPage() {
  if (isStaticExport()) {
    return (
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:py-14">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
            Sharing
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-4xl tracking-tight text-ink sm:text-5xl">
            Class info board
          </h1>
        </div>
        <StaticFeatureNotice
          title="Sharing needs the live server"
          description="GitHub Pages can only host the static study pages. Run the app locally to post and browse shared class updates."
        />
      </div>
    );
  }

  const user = await getSessionUser();
  if (!user) redirect("/login?next=/sharing");
  if (user.status !== "approved") redirect("/pending");

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:py-14">
      <div className="max-w-2xl">
        <p className="animate-rise text-sm font-medium uppercase tracking-[0.18em] text-accent">
          Sharing
        </p>
        <span
          className="animate-draw delay-1 mt-3 block h-[2px] w-14 bg-accent"
          aria-hidden
        />
        <h1 className="animate-rise delay-1 mt-4 font-[family-name:var(--font-fraunces)] text-4xl tracking-tight text-ink sm:text-5xl">
          Class info board
        </h1>
        <p className="animate-rise delay-2 mt-3 text-lg text-ink-soft">
          Post reminders, study tips, and helpful links so everyone in Math 1/2
          stays on the same page.
        </p>
      </div>
      <SharingBoard
        currentUserId={user.id}
        isAdmin={user.role === "admin"}
      />
    </div>
  );
}
