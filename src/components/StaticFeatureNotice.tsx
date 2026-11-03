import Link from "next/link";

export function StaticFeatureNotice({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mt-8 rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow)] sm:p-8">
      <h2 className="font-[family-name:var(--font-fraunces)] text-2xl text-ink">
        {title}
      </h2>
      <p className="mt-3 text-ink-soft">{description}</p>
      <p className="mt-4 text-sm text-ink-soft">
        Lessons, classwork drills, and textbook PDFs work fully on this site.
        Account features (sign-in, sharing uploads, admin approval) need the
        local or hosted Node server.
      </p>
      <Link
        href="/learning"
        className="mt-6 inline-flex rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-deep"
      >
        Go to Learning
      </Link>
    </div>
  );
}
