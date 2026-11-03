import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentForm } from "@/components/CommentForm";
import { MathText } from "@/components/MathText";
import { getPost, getRoom } from "@/lib/db";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ code: string; id: string }>;
};

export default async function PostPage({ params }: PageProps) {
  const { code, id } = await params;
  const room = getRoom(code);
  if (!room) notFound();
  const post = getPost(room.code, id);
  if (!post) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <Link
        href={`/class/${room.code}`}
        className="text-sm text-ink-soft hover:text-accent"
      >
        ← Back to {room.name}
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
          <p className="mt-1 whitespace-pre-wrap text-ink-soft">{post.workText}</p>
          <p className="mt-3 text-ink-soft">
            Answer submitted: <span className="text-ink">{post.answer || "—"}</span>
          </p>
          <p
            className={`mt-2 text-sm ${
              post.isCorrect ? "text-ok" : "text-warn"
            }`}
          >
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
            <p className="text-sm text-ink-soft">
              No comments yet. Leave a hint.
            </p>
          ) : (
            post.comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-xl border border-line bg-paper/50 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-2 text-xs text-ink-soft">
                  <span className="font-medium text-ink">
                    {comment.authorName}
                  </span>
                  <span>{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <p className="mt-2 text-sm whitespace-pre-wrap">{comment.body}</p>
              </div>
            ))
          )}
        </div>
        <CommentForm roomCode={room.code} postId={post.id} />
      </section>
    </div>
  );
}
