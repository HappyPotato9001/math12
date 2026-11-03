"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CommentForm } from "@/components/CommentForm";
import { MathText } from "@/components/MathText";
import { WorkImage } from "@/components/WorkImage";

type Comment = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
};

type PostView = {
  id: string;
  authorName: string;
  topicPath: string;
  topicTitle: string;
  problemPrompt: string;
  workText: string;
  answer: string;
  isCorrect: boolean;
  imageId?: string;
  createdAt: string;
  comments: Comment[];
};

export function ClassPostClient() {
  const searchParams = useSearchParams();
  const code = (searchParams.get("code") || "").toUpperCase();
  const id = searchParams.get("id") || "";
  const [roomName, setRoomName] = useState("");
  const [post, setPost] = useState<PostView | null>(null);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!code || !id) {
      setMissing(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [roomRes, postRes] = await Promise.all([
        fetch(`/api/rooms/${code}`),
        fetch(`/api/rooms/${code}/posts/${id}`),
      ]);
      if (!roomRes.ok || !postRes.ok) {
        setMissing(true);
        setPost(null);
        return;
      }
      const roomData = await roomRes.json();
      const postData = await postRes.json();
      setMissing(false);
      setRoomName(roomData.room.name);
      setPost(postData.post);
    } catch {
      setMissing(true);
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [code, id]);

  useEffect(() => {
    void reload();
  }, [reload]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-14 text-ink-soft">
        Loading post…
      </div>
    );
  }

  if (missing || !post) {
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
        <h1 className="font-[family-name:var(--font-fraunces)] text-3xl text-ink">
          Post not found
        </h1>
        <Link href="/class" className="mt-4 inline-block text-accent underline">
          Back to class rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <Link
        href={`/class/room/?code=${code}`}
        className="text-sm text-ink-soft hover:text-accent"
      >
        ← Back to {roomName}
      </Link>

      <article className="mt-5 rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-medium text-ink">{post.authorName}</p>
          <p className="text-xs text-ink-soft">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
        <Link href={post.topicPath} className="mt-1 inline-block text-sm text-accent">
          {post.topicTitle}
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-2xl text-ink">
          <MathText text={post.problemPrompt} />
        </h1>
        <div className="mt-4 rounded-xl bg-paper-deep/70 px-4 py-3 text-sm">
          <p className="font-medium text-ink">Their work</p>
          {post.imageId && (
            <WorkImage
              imageId={post.imageId}
              alt={`Work photo from ${post.authorName}`}
              className="mt-3 max-h-[28rem] w-full rounded-xl border border-line object-contain bg-paper"
            />
          )}
          <p className="mt-3 whitespace-pre-wrap text-ink-soft">{post.workText}</p>
          {post.answer && (
            <p className="mt-3 text-ink-soft">
              Answer submitted: <span className="text-ink">{post.answer}</span>
            </p>
          )}
          <p className={`mt-2 text-sm ${post.isCorrect ? "text-ok" : "text-warn"}`}>
            {post.isCorrect ? "Marked correct" : "Marked incorrect / needs help"}
          </p>
        </div>
      </article>

      <section className="mt-6 rounded-2xl border border-line bg-surface p-6">
        <h2 className="font-[family-name:var(--font-fraunces)] text-xl text-ink">
          Comments
        </h2>
        <div className="mt-4 space-y-3">
          {post.comments.length === 0 ? (
            <p className="text-sm text-ink-soft">No comments yet. Leave a hint.</p>
          ) : (
            post.comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-xl border border-line bg-paper/50 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-2 text-xs text-ink-soft">
                  <span className="font-medium text-ink">{comment.authorName}</span>
                  <span>{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <p className="mt-2 text-sm whitespace-pre-wrap">{comment.body}</p>
              </div>
            ))
          )}
        </div>
        <CommentForm
          roomCode={code}
          postId={post.id}
          onCommented={() => void reload()}
        />
      </section>
    </div>
  );
}
