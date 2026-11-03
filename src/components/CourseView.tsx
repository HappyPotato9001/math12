import Link from "next/link";
import type { CourseMeta } from "@/lib/types";
import { topicKey } from "@/lib/content";
import { assetPath } from "@/lib/paths";
import { ProgressChip } from "./ProgressChip";

export function CourseView({ course }: { course: CourseMeta }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:py-14">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
          Textbook pathway
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-4xl tracking-tight text-ink sm:text-5xl">
          {course.title}
        </h1>
        <p className="mt-3 text-lg text-ink-soft">{course.description}</p>
      </div>

      <div className="mt-10 space-y-8">
        {course.units.map((unit) => (
          <section
            key={unit.slug}
            className="rounded-2xl border border-line bg-surface/90 p-5 shadow-[var(--shadow)] sm:p-7"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-[family-name:var(--font-fraunces)] text-2xl text-ink">
                  {unit.title}
                </h2>
                <p className="mt-1 text-sm text-ink-soft">{unit.description}</p>
              </div>
              <a
                href={assetPath(unit.pdf)}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-paper-deep"
              >
                Open unit PDF
              </a>
            </div>
            <ul className="mt-5 divide-y divide-line/80">
              {unit.topics.map((topic) => {
                const href = `/${course.id}/${unit.slug}/${topic.slug}`;
                const key = topicKey(course.id, unit.slug, topic.slug);
                return (
                  <li
                    key={topic.slug}
                    className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                        Lesson {topic.lessonNumber}
                      </p>
                      <Link
                        href={href}
                        className="text-base font-medium text-ink hover:text-accent"
                      >
                        {topic.title}
                      </Link>
                      <p className="mt-1 text-sm text-ink-soft">{topic.summary}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {topic.status === "ready" ? (
                        <>
                          <ProgressChip topicKey={key} />
                          <Link
                            href={href}
                            className="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-paper-deep"
                          >
                            Lesson
                          </Link>
                          <Link
                            href={`${href}/practice`}
                            className="rounded-lg bg-accent px-3 py-1.5 text-sm text-white hover:bg-accent-deep"
                          >
                            Classwork
                          </Link>
                        </>
                      ) : (
                        <span className="rounded-full border border-line px-2.5 py-1 text-xs text-ink-soft">
                          Use unit PDF
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
