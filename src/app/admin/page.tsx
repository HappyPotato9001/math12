import { redirect } from "next/navigation";
import { AdminUsersClient } from "@/components/AdminUsersClient";
import { getSessionUser } from "@/lib/server/session";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin" || user.status !== "approved") {
    redirect(user.status === "approved" ? "/learning" : "/pending");
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
        Admin
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-4xl tracking-tight text-ink">
        Approve access
      </h1>
      <p className="mt-3 text-ink-soft">
        Accept pending accounts here to unlock Math 1/2 lessons, sharing, and
        practice tests for that student.
      </p>
      <div className="mt-8">
        <AdminUsersClient />
      </div>
    </div>
  );
}
