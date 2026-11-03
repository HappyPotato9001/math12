import Link from "next/link";
import { getCourse } from "@/lib/curriculum";

export default function LearningPage() {
  const math1 = getCourse("math1");
  const math2 = getCourse("math2");

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:py-14">
      <div className="max-w-2xl">
        <p className="animate-rise text-sm font-medium uppercase tracking-[0.18em] text-accent">
          Learning
        </p>
        <span
          className="animate-draw delay-1 mt-3 block h-[2px] w-14 bg-accent"
          aria-hidden
        />
        <h1 className="animate-rise delay-1 mt-4 font-[family-name:var(--font-fraunces)] text-4xl tracking-tight text-ink sm:text-5xl">
          Lessons & classwork
        </h1>
        <p className="animate-rise delay-2 mt-3 text-lg text-ink-soft">
          Digitized textbook pathways for Integrated Math 1 and 2—open a course,
          then work through every unit lesson and drill.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {[math1, math2].map((course, index) => {
          if (!course) return null;
          const unitCount = course.units.length;
          const topicCount = course.units.reduce(
            (sum, unit) => sum + unit.topics.length,
            0,
          );
          return (
            <Link
              key={course.id}
              href={`/${course.id}`}
              className={`group relative overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow)] transition hover:-translate-y-0.5 hover:border-accent/35 sm:p-8 animate-rise ${index === 0 ? "delay-2" : "delay-3"}`}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-accent transition duration-500 group-hover:scale-x-100"
                aria-hidden
              />
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
                Course
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl text-ink transition group-hover:text-accent">
                {course.title}
              </h2>
              <p className="mt-3 text-ink-soft">{course.description}</p>
              <p className="mt-5 text-sm text-ink-soft">
                {unitCount} units · {topicCount} topics · all lessons ready
              </p>
              <span className="mt-6 inline-flex rounded-lg bg-accent px-3 py-1.5 text-sm text-white transition group-hover:bg-accent-deep">
                Open {course.shortTitle}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
