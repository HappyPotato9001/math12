import Link from "next/link";
import { PendingActions } from "@/components/PendingActions";
import { SessionSync } from "@/components/SessionSync";
import { getSessionUser } from "@/lib/server/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PendingPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  // DB already approved (e.g. admin Accept) but JWT may still say pending —
  // sync the session cookie instead of bouncing with middleware.
  if (user.status === "approved") {
    return (
      <div className="mx-auto w-full max-w-lg px-5 py-10 sm:py-14">
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow)] sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
            Access granted
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl tracking-tight text-ink">
            You&apos;re approved
          </h1>
          <div className="mt-6">
            <SessionSync
              redirectTo={user.role === "admin" ? "/admin" : "/learning"}
              label="Opening your account…"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg px-5 py-10 sm:py-14">
      <div className="rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow)] sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
          Access pending
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl tracking-tight text-ink">
          Waiting for approval
        </h1>
        <p className="mt-3 text-ink-soft">
          Hi {user.name}. Your account{" "}
          <span className="text-ink">{user.email}</span> is signed up, but an
          admin still needs to accept you before Math 1/2 unlocks.
        </p>
        <p className="mt-3 text-sm text-ink-soft">
          Current status:{" "}
          <span className="font-medium capitalize text-ink">{user.status}</span>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-xl border border-line px-4 py-2.5 text-sm hover:bg-paper-deep"
          >
            Back home
          </Link>
          <PendingActions />
        </div>
      </div>
    </div>
  );
}
