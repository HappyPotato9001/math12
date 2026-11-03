import Link from "next/link";

export default function Home() {
  return (
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2">
      <section className="relative min-h-[calc(100vh-4.5rem)] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 78% 28%, rgba(31,122,77,0.22), transparent 42%), radial-gradient(circle at 18% 72%, rgba(21,32,24,0.08), transparent 36%), linear-gradient(125deg, #f7fbf8 0%, #e8f1eb 48%, #d5e8dc 100%)",
          }}
        />
        <div
          className="animate-fade absolute inset-y-0 right-0 w-[58%] opacity-[0.45]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(21,32,24,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(21,32,24,0.09) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage:
              "linear-gradient(90deg, transparent, black 18%, black 78%, transparent)",
          }}
        />
        <div
          className="animate-fade delay-1 pointer-events-none absolute -right-8 top-16 h-64 w-64 rounded-full border border-accent/20 sm:h-80 sm:w-80"
          aria-hidden
        />
        <div
          className="animate-fade delay-2 pointer-events-none absolute right-16 top-28 h-40 w-40 rounded-full border border-accent/30 sm:right-28"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4.5rem)] w-full max-w-6xl flex-col justify-end px-5 pb-16 pt-20 sm:px-8 sm:pb-24">
          <p className="animate-rise text-sm font-medium uppercase tracking-[0.22em] text-accent">
            Class study lab
          </p>
          <span
            className="animate-draw delay-1 mt-3 block h-[2px] w-16 bg-accent"
            aria-hidden
          />
          <h1 className="animate-rise delay-1 mt-5 max-w-3xl font-[family-name:var(--font-fraunces)] text-6xl leading-[0.92] tracking-tight text-ink sm:text-8xl">
            Math 1/2
          </h1>
          <p className="animate-rise delay-2 mt-6 max-w-xl text-lg text-ink-soft sm:text-xl">
            Lessons, class sharing, and practice tests for Integrated Math—sign
            up, get approved, then dive in.
          </p>
          <div className="animate-rise delay-3 mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white transition hover:bg-accent-deep"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-ink/15 bg-surface/75 px-5 py-3 text-sm font-medium text-ink backdrop-blur-sm transition hover:bg-paper-deep"
            >
              Sign in
            </Link>
            <Link
              href="/learning"
              className="rounded-xl px-5 py-3 text-sm font-medium text-accent transition hover:bg-accent-soft"
            >
              Go to Learning
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
