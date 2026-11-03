import { redirect } from "next/navigation";
import { NotebookWorkspace, type NotebookSource } from "@/components/NotebookWorkspace";
import { StaticFeatureNotice } from "@/components/StaticFeatureNotice";
import { isStaticExport } from "@/lib/runtime";
import { getSessionUser } from "@/lib/server/session";
import { getLessonMarkdown } from "@/lib/content";
import { courses } from "@/lib/curriculum";

export default async function NotebookPage() {
  if (isStaticExport()) {
    return (
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:py-14">
        <StaticFeatureNotice
          title="Notebook needs the live server"
          description="Your source-grounded study notebook is available when you run the Node app locally or on the live site."
        />
      </div>
    );
  }

  const user = await getSessionUser();
  if (!user) redirect("/login?next=/notebook");
  if (user.status !== "approved") redirect("/pending");

  const sources: NotebookSource[] = courses.flatMap((course) =>
    course.units.flatMap((unit) =>
      unit.topics.map((topic) => {
        const content = getLessonMarkdown(course.id, unit.slug, topic.slug) || "";
        return {
          id: `${course.id}/${unit.slug}/${topic.slug}`,
          course: course.shortTitle,
          title: topic.title,
          unit: unit.title,
          href: `/${course.id}/${unit.slug}/${topic.slug}`,
          summary: topic.summary,
          excerpt: content.replace(/\s+/g, " ").trim().slice(0, 900),
        };
      }),
    ),
  );

  return <NotebookWorkspace sources={sources} />;
}