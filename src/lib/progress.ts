import type { TopicProgress } from "./types";

const STORAGE_KEY = "math12-progress-v1";

function emptyProgress(): TopicProgress {
  return {
    attempted: 0,
    correct: 0,
    streak: 0,
    bestStreak: 0,
  };
}

export function readAllProgress(): Record<string, TopicProgress> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, TopicProgress>;
  } catch {
    return {};
  }
}

export function readTopicProgress(topicKey: string): TopicProgress {
  return readAllProgress()[topicKey] ?? emptyProgress();
}

export function recordAttempt(
  topicKey: string,
  problemId: string,
  correct: boolean,
): TopicProgress {
  const all = readAllProgress();
  const current = all[topicKey] ?? emptyProgress();
  const streak = correct ? current.streak + 1 : 0;
  const next: TopicProgress = {
    attempted: current.attempted + 1,
    correct: current.correct + (correct ? 1 : 0),
    streak,
    bestStreak: Math.max(current.bestStreak, streak),
    lastProblemId: problemId,
  };
  all[topicKey] = next;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return next;
}

export function accuracyPercent(progress: TopicProgress): number {
  if (progress.attempted === 0) return 0;
  return Math.round((progress.correct / progress.attempted) * 100);
}
