import { notFound } from "next/navigation";
import { CourseView } from "@/components/CourseView";
import { getCourse } from "@/lib/curriculum";

export default function Math1Page() {
  const course = getCourse("math1");
  if (!course) notFound();
  return <CourseView course={course} />;
}
