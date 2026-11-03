"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/learning", label: "Learning" },
  { href: "/sharing", label: "Sharing" },
  { href: "/practice-tests", label: "Practice tests" },
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-0.5 rounded-xl border border-line/80 bg-paper/50 p-0.5 text-sm font-medium sm:gap-1 sm:p-1">
      {tabs.map((tab) => {
        const active =
          pathname === tab.href ||
          pathname.startsWith(`${tab.href}/`) ||
          (tab.href === "/learning" &&
            (pathname.startsWith("/math1") || pathname.startsWith("/math2")));

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={
              active
                ? "rounded-lg bg-surface px-2.5 py-1.5 text-accent-deep shadow-sm sm:px-3"
                : "rounded-lg px-2.5 py-1.5 text-ink-soft transition hover:bg-paper-deep/80 hover:text-ink sm:px-3"
            }
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
