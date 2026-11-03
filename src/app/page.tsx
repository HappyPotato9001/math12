import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col px-5 pb-16 pt-10 sm:pt-16">
      <section className="relative min-h-[70vh] overflow-hidden rounded-[2rem] border border-line bg-surface shadow-[var(--shadow)]">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(circle at 70% 30%, rgba(15,110,86,0.18), transparent 40%), linear-gradient(135deg, #fffdf8 0%, #efe6d6 55%, #dcefe7 100%)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-[55%] opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(28,36,48,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(28,36,48,0.08) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
            maskImage:
              "linear-gradient(90deg, transparent, black 20%, black 80%, transparent)",
          }}
        />
        <div className="relative z-10 flex min-h-[70vh] flex-col justify-end gap-8 p-8 sm:p-14">
          <p className="animate-rise text-sm font-medium uppercase tracking-[0.22em] text-accent">
            Your class textbook, online
          </p>
          <h1 className="animate-rise max-w-3xl font-[family-name:var(--font-fraunces)] text-5xl leading-[0.95] tracking-tight text-ink sm:text-7xl">
            Math 1/2
          </h1>
          <p className="animate-rise max-w-xl text-lg text-ink-soft sm:text-xl">
            Follow the same units and lesson titles from class. Open the packet
            PDF, do textbook-style classwork with instant feedback, and share
            photos of your work.
          </p>
          <div className="animate-rise flex flex-wrap gap-3">
            <Link
              href="/math1"
              className="rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white transition hover:bg-accent-deep"
            >
              Math 1 units
            </Link>
            <Link
              href="/math2"
              className="rounded-xl border border-ink/15 bg-surface/80 px-5 py-3 text-sm font-medium text-ink transition hover:bg-paper-deep"
            >
              Math 2 units
            </Link>
            <Link
              href="/class"
              className="rounded-xl border border-ink/15 bg-surface/80 px-5 py-3 text-sm font-medium text-ink transition hover:bg-paper-deep"
            >
              Class room
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
