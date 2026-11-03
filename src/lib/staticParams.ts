import { courses } from "./curriculum";

export function allTopicParams() {
  return courses.flatMap((course) =>
    course.units.flatMap((unit) =>
      unit.topics.map((topic) => ({
        course: course.id,
        unit: unit.slug,
        topic: topic.slug,
      })),
    ),
  );
}
