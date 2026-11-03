import { AdminUsersClient } from "@/components/AdminUsersClient";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
        Admin
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-4xl tracking-tight text-ink">
        Approve access
      </h1>
      <p className="mt-3 text-ink-soft">
        Students can sign up with email, Google, or GitHub. Accept an account
        here to unlock Math 1/2 lessons and classwork.
      </p>
      <div className="mt-8">
        <AdminUsersClient />
      </div>
    </div>
  );
}
