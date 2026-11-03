"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MathText } from "@/components/MathText";
import { PhotoWorkForm } from "@/components/PhotoWorkForm";
import { WorkImage } from "@/components/WorkImage";
import { exportRoomData, getRoom, listPosts } from "@/lib/db";

type FeedPost = ReturnType<typeof listPosts>[number];

export function ClassFeedClient() {
  const searchParams = useSearchParams();
  const code = (searchParams.get("code") || "").toUpperCase();
  const [roomName, setRoomName] = useState<string | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [copied, setCopied] = useState(false);
  const [missing, setMissing] = useState(false);

  const reload = useCallback(() => {
    if (!code) {
      setMissing(true);
      return;
    }
    const room = getRoom(code);
    if (!room) {
      setMissing(true);
      setRoomName(null);
      setPosts([]);
      return;
    }
    setMissing(false);
    setRoomName(room.name);
    setPosts(listPosts(room.code));
  }, [code]);

  useEffect(() => {
    reload();
  }, [reload]);

  async function copyExport() {
    const payload = await exportRoomData(code);
    await navigator.clipboard.writeText(JSON.stringify(payload));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  if (missing) {
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
        <h1 className="font-[family-name:var(--font-fraunces)] text-3xl text-ink">
          Room not found
        </h1>
        <p className="mt-3 text-ink-soft">
          This browser does not have that class room yet. Join the code on the
          class page, or import room JSON from a classmate.
        </p>
        <Link
          href="/class/"
          className="mt-5 inline-block rounded-xl bg-accent px-4 py-2 text-sm text-white"
        >
          Go to class rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
            Class room
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-4xl tracking-tight text-ink">
            {roomName}
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            Code <span className="font-medium text-ink">{code}</span> — share it
            with classmates
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void copyExport()}
            className="rounded-xl border border-line px-3 py-2 text-sm hover:bg-paper-deep"
          >
            {copied ? "Copied export" : "Export room"}
          </button>
          <Link
            href="/class/"
            className="rounded-xl border border-line px-3 py-2 text-sm hover:bg-paper-deep"
          >
            Switch room
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <PhotoWorkForm roomCode={code} onPosted={reload} />
      </div>

      <div className="mt-8 space-y-4">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-surface p-8 text-ink-soft">
            No shared work yet. Post a photo above, or share from practice.
          </div>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/class/post/?code=${code}&id=${post.id}`}
              className="block animate-rise rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow)] transition hover:border-accent/40"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-ink">{post.authorName}</p>
                <p className="text-xs text-ink-soft">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
              <p className="mt-1 text-sm text-accent">{post.topicTitle}</p>
              <p className="mt-3 text-ink">
                <MathText text={post.problemPrompt} />
              </p>
              {post.imageId && (
                <WorkImage
                  imageId={post.imageId}
                  alt={`Work photo from ${post.authorName}`}
                  className="mt-3 max-h-48 w-full rounded-xl border border-line object-cover bg-paper"
                />
              )}
              <p className="mt-3 line-clamp-3 text-sm text-ink-soft">
                {post.workText}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span
                  className={`rounded-full px-2.5 py-1 ${
                    post.isCorrect
                      ? "bg-ok-soft text-ok"
                      : "bg-warn-soft text-warn"
                  }`}
                >
                  {post.isCorrect ? "Marked correct" : "Needs help"}
                </span>
                {post.imageId && (
                  <span className="rounded-full border border-line px-2.5 py-1 text-ink-soft">
                    Photo attached
                  </span>
                )}
                <span className="rounded-full border border-line px-2.5 py-1 text-ink-soft">
                  {post.commentCount} comment
                  {post.commentCount === 1 ? "" : "s"}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
