"use client";

import { useEffect, useState } from "react";
import { accuracyPercent, readTopicProgress } from "@/lib/progress";

export function ProgressChip({ topicKey }: { topicKey: string }) {
  const [label, setLabel] = useState("Not started");

  useEffect(() => {
    const progress = readTopicProgress(topicKey);
    if (progress.attempted === 0) {
      setLabel("Not started");
      return;
    }
    setLabel(`${accuracyPercent(progress)}% · ${progress.attempted} tries`);
  }, [topicKey]);

  return (
    <span className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-ink-soft">
      {label}
    </span>
  );
}
