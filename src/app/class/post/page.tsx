import { Suspense } from "react";
import { ClassPostClient } from "@/components/ClassPostClient";

export default function ClassPostPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-5 py-14 text-ink-soft">
          Loading post…
        </div>
      }
    >
      <ClassPostClient />
    </Suspense>
  );
}
