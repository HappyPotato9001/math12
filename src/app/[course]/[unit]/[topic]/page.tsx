import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownView } from "@/components/MarkdownView";
import { getLessonMarkdown } from "@/lib/content";
import { getCourse, getTopic, getUnit } from "@/lib/curriculum";
import { assetPath } from "@/lib/paths";
import { allTopicParams } from "@/lib/staticParams";
import type { CourseId } from "@/lib/types";

type PageProps = {
  params: Promise<{ course: string; unit: string; topic: string }>;
};

export function generateStaticParams() {
  return allTopicParams();
}

export default async function TopicLessonPage({ params }: PageProps) {
  const { course: courseId, unit: unitSlug, topic: topicSlug } = await params;
  if (courseId !== "math1" && courseId !== "math2") notFound();

  const course = getCourse(courseId as CourseId);
  const unit = getUnit(courseId, unitSlug);
  const topic = getTopic(courseId, unitSlug, topicSlug);
  if (!course || !unit || !topic) notFound();

  const lesson = getLessonMarkdown(courseId, unitSlug, topicSlug);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <div className="text-sm text-ink-soft">
        <Link href={`/${courseId}`} className="hover:text-accent">
          {course.shortTitle}
        </Link>
        <span className="mx-2">/</span>
        <span>{unit.title}</span>
      </div>
      <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-accent">
        Lesson {topic.lessonNumber}
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-4xl tracking-tight text-ink">
        {topic.title}
      </h1>
      <p className="mt-2 text-ink-soft">{topic.summary}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href={`/${courseId}/${unitSlug}/${topicSlug}/practice`}
          className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-deep"
        >
          Do classwork
        </Link>
        <a
          href={assetPath(unit.pdf)}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-line px-4 py-2.5 text-sm hover:bg-paper-deep"
        >
          Open textbook PDF
        </a>
        <Link
          href={`/${courseId}`}
          className="rounded-xl border border-line px-4 py-2.5 text-sm hover:bg-paper-deep"
        >
          All units
        </Link>
      </div>

      <article className="mt-8 rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow)] sm:p-8">
        {topic.status === "stub" || !lesson ? (
          <div>
            <h2 className="font-[family-name:var(--font-fraunces)] text-2xl">
              Use the class textbook
            </h2>
            <p className="mt-3 text-ink-soft">
              This lesson follows your school packet. Open the unit PDF for Jump
              Start, Launch/Explore, Ready for More, and Takeaways. Digitized
              classwork drills are available on ready lessons.
            </p>
            <a
              href={assetPath(unit.pdf)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-accent underline"
            >
              Open {unit.title} PDF
            </a>
          </div>
        ) : (
          <MarkdownView content={lesson} />
        )}
      </article>
    </div>
  );
}
