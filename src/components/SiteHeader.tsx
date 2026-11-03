import Link from "next/link";
import { AuthButtons } from "./AuthButtons";
import { SiteNav } from "./SiteNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line/70 bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-y-2 px-4 py-3 sm:gap-4 sm:px-5 sm:py-3.5">
        <Link href="/" className="group flex min-w-0 items-baseline gap-2">
          <span className="font-[family-name:var(--font-fraunces)] text-xl tracking-tight text-ink transition group-hover:text-accent sm:text-2xl">
            Math 1/2
          </span>
          <span className="hidden text-sm text-ink-soft sm:inline">
            study lab
          </span>
        </Link>
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end sm:gap-3">
          <SiteNav />
          <AuthButtons />
        </div>
      </div>
    </header>
  );
}
