import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="relative z-10 border-b border-line/70 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4">
        <Link href="/" className="group flex min-w-0 items-baseline gap-2">
          <span className="font-[family-name:var(--font-fraunces)] text-xl tracking-tight text-ink transition group-hover:text-accent sm:text-2xl">
            Math 1/2
          </span>
          <span className="hidden text-sm text-ink-soft sm:inline">study lab</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium sm:gap-2">
          <Link
            href="/math1"
            className="rounded-md px-2.5 py-2 text-ink-soft transition hover:bg-paper-deep hover:text-ink sm:px-3"
          >
            Math 1
          </Link>
          <Link
            href="/math2"
            className="rounded-md bg-accent px-2.5 py-2 text-white transition hover:bg-accent-deep sm:px-3"
          >
            Math 2
          </Link>
        </nav>
      </div>
    </header>
  );
}
