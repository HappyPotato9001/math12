import { ClassRoomClient } from "@/components/ClassRoomClient";

export default function ClassPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-5 py-10 sm:py-14">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
        Together
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-4xl tracking-tight text-ink">
        Class room
      </h1>
      <p className="mt-3 text-ink-soft">
        Create a room, share the code, and post notes or photos of your work.
        Everything is saved on the server so classmates can refresh and see it.
      </p>
      <div className="mt-8">
        <ClassRoomClient />
      </div>
    </div>
  );
}
