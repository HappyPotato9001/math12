"use client";

import { useMemo } from "react";
import { accuracyPercent, readTopicProgress } from "@/lib/progress";

export function ProgressChip({ topicKey }: { topicKey: string }) {
  const label = useMemo(() => {
    const progress = readTopicProgress(topicKey);
    return progress.attempted === 0
      ? "Not started"
      : `${accuracyPercent(progress)}% · ${progress.attempted} tries`;
  }, [topicKey]);

  return (
    <span className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-ink-soft">
      {label}
    </span>
  );
}
