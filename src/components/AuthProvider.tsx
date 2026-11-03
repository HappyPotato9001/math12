"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useRef, type ReactNode } from "react";
import { isStaticExport } from "@/lib/runtime";

function SessionRefresher({ children }: { children: ReactNode }) {
  const { status, update } = useSession();
  const refreshed = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || refreshed.current) return;
    refreshed.current = true;
    void update();
  }, [status, update]);

  return children;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  if (isStaticExport()) {
    return children;
  }

  return (
    <SessionProvider>
      <SessionRefresher>{children}</SessionRefresher>
    </SessionProvider>
  );
}
