import { Suspense } from "react";
import { ClassFeedClient } from "@/components/ClassFeedClient";

export default function ClassRoomPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-5 py-14 text-ink-soft">
          Loading room…
        </div>
      }
    >
      <ClassFeedClient />
    </Suspense>
  );
}
