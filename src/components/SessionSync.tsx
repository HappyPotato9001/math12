"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/** Pulls latest role/status from the DB into the JWT cookie, then navigates. */
export function SessionSync({
  redirectTo,
  label = "Updating your access…",
}: {
  redirectTo?: string;
  label?: string;
}) {
  const router = useRouter();
  const { data, status, update } = useSession();
  const ran = useRef(false);

  useEffect(() => {
    if (status === "loading" || ran.current) return;
    ran.current = true;

    void (async () => {
      const session = await update();
      const role = session?.user?.role ?? data?.user?.role;
      const next =
        redirectTo ??
        (role === "admin" ? "/admin" : "/learning");
      router.replace(next);
      router.refresh();
    })();
  }, [status, update, router, redirectTo, data?.user?.role]);

  return <p className="text-sm text-ink-soft">{label}</p>;
}
