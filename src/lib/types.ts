export type CourseId = "math1" | "math2";

export type ProblemType = "multiple-choice" | "numeric" | "expression";

export type Problem = {
  id: string;
  type: ProblemType;
  prompt: string;
  choices?: string[];
  answer: string | number;
  acceptedAnswers?: string[];
  hint: string;
  solution: string;
  explanation: string;
};

export type TopicMeta = {
  slug: string;
  title: string;
  summary: string;
  status: "ready" | "stub";
};

export type UnitMeta = {
  slug: string;
  title: string;
  description: string;
  topics: TopicMeta[];
};

export type CourseMeta = {
  id: CourseId;
  title: string;
  shortTitle: string;
  description: string;
  units: UnitMeta[];
};

export type TopicProgress = {
  attempted: number;
  correct: number;
  streak: number;
  bestStreak: number;
  lastProblemId?: string;
};
