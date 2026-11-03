import Link from "next/link";
import { notFound } from "next/navigation";
import { PracticeDrill } from "@/components/PracticeDrill";
import { getProblems, topicKey } from "@/lib/content";
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

export default async function PracticePage({ params }: PageProps) {
  const { course: courseId, unit: unitSlug, topic: topicSlug } = await params;
  if (courseId !== "math1" && courseId !== "math2") notFound();

  const course = getCourse(courseId as CourseId);
  const unit = getUnit(courseId, unitSlug);
  const topic = getTopic(courseId, unitSlug, topicSlug);
  if (!course || !unit || !topic) notFound();

  const problems = getProblems(courseId, unitSlug, topicSlug);
  const lessonHref = `/${courseId}/${unitSlug}/${topicSlug}`;
  const key = topicKey(courseId, unitSlug, topicSlug);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <div className="text-sm text-ink-soft">
        <Link href={`/${courseId}`} className="hover:text-accent">
          {course.shortTitle}
        </Link>
        <span className="mx-2">/</span>
        <Link href={lessonHref} className="hover:text-accent">
          {topic.title}
        </Link>
        <span className="mx-2">/</span>
        <span>Classwork</span>
      </div>
      <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-accent">
        Lesson {topic.lessonNumber} classwork
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-4xl tracking-tight text-ink">
        {topic.title}
      </h1>
      <p className="mt-2 text-ink-soft">
        Textbook-style prompts with instant feedback. Stuck? Share a photo of
        your work with the class room.
      </p>

      <div className="mt-4">
        <a
          href={assetPath(unit.pdf)}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-accent underline"
        >
          Open matching unit PDF
        </a>
      </div>

      <div className="mt-8">
        {topic.status === "stub" || problems.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface p-8">
            <p className="text-ink-soft">
              Digitized classwork for this lesson is still being added. Use the
              unit PDF for the full Jump Start / Launch / Ready for More set.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={assetPath(unit.pdf)}
                target="_blank"
                rel="noreferrer"
                className="text-accent underline"
              >
                Open unit PDF
              </a>
              <Link href={lessonHref} className="text-accent underline">
                Back to lesson
              </Link>
            </div>
          </div>
        ) : (
          <PracticeDrill
            topicKey={key}
            topicTitle={`Lesson ${topic.lessonNumber}: ${topic.title}`}
            topicPath={lessonHref}
            lessonHref={lessonHref}
            problems={problems}
          />
        )}
      </div>
    </div>
  );
}
