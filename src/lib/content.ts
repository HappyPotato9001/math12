import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Problem } from "./types";

const contentRoot = path.join(process.cwd(), "content");

export function getLessonMarkdown(
  courseId: string,
  unitSlug: string,
  topicSlug: string,
): string | null {
  const filePath = path.join(
    contentRoot,
    courseId,
    unitSlug,
    topicSlug,
    "lesson.md",
  );
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { content } = matter(raw);
  return content.trim();
}

export function getProblems(
  courseId: string,
  unitSlug: string,
  topicSlug: string,
): Problem[] {
  const filePath = path.join(
    contentRoot,
    courseId,
    unitSlug,
    topicSlug,
    "problems.json",
  );
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as Problem[];
}

export function topicKey(courseId: string, unitSlug: string, topicSlug: string) {
  return `${courseId}/${unitSlug}/${topicSlug}`;
}
