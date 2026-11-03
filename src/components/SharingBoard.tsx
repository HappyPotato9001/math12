"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, type FormEvent } from "react";

type ShareCourse = "math1" | "math2" | "general";

type SharePost = {
  id: string;
  title: string;
  body: string;
  course: ShareCourse;
  link?: string;
  authorId: string;
  authorName: string;
  createdAt: string;
};

const courseLabel: Record<ShareCourse, string> = {
  general: "General",
  math1: "Math 1",
  math2: "Math 2",
};

export function SharingBoard({
  currentUserId,
  isAdmin,
}: {
  currentUserId: string;
  isAdmin: boolean;
}) {
  const [posts, setPosts] = useState<SharePost[] | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [course, setCourse] = useState<ShareCourse>("general");
  const [link, setLink] = useState("");
  const { status: sessionStatus } = useSession();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const response = await fetch("/api/shares");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to load");
    setPosts(Array.isArray(data.posts) ? data.posts : []);
  }

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (sessionStatus !== "authenticated") {
      setPosts([]);
      return;
    }
    void load().catch((err) => {
      setPosts([]);
      setError(err instanceof Error ? err.message : "Could not load posts");
    });
  }, [sessionStatus]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/shares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          course,
          link: link.trim() || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not post");
      setTitle("");
      setBody("");
      setLink("");
      setCourse("general");
      setPosts((prev) => [data.post, ...(prev || [])]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    const response = await fetch(`/api/shares/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Could not delete");
      return;
    }
    setPosts((prev) => (prev || []).filter((post) => post.id !== id));
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
      <form
        onSubmit={(event) => void onSubmit(event)}
        className="h-fit rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow)] sm:p-6"
      >
        <h2 className="font-[family-name:var(--font-fraunces)] text-xl text-ink">
          Share with the class
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Tips, reminders, review notes, or useful links.
        </p>

        <label className="mt-4 block text-sm font-medium text-ink">
          Title
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper/40 px-3 py-2.5 outline-none ring-accent focus:ring-2"
            placeholder="Unit 3 review sheet tip"
          />
        </label>

        <label className="mt-3 block text-sm font-medium text-ink">
          Course
          <select
            value={course}
            onChange={(event) => setCourse(event.target.value as ShareCourse)}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper/40 px-3 py-2.5 outline-none ring-accent focus:ring-2"
          >
            <option value="general">General</option>
            <option value="math1">Math 1</option>
            <option value="math2">Math 2</option>
          </select>
        </label>

        <label className="mt-3 block text-sm font-medium text-ink">
          Note
          <textarea
            required
            rows={5}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper/40 px-3 py-2.5 outline-none ring-accent focus:ring-2"
            placeholder="What should classmates know?"
          />
        </label>

        <label className="mt-3 block text-sm font-medium text-ink">
          Optional link
          <input
            type="url"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper/40 px-3 py-2.5 outline-none ring-accent focus:ring-2"
            placeholder="https://"
          />
        </label>

        {error && <p className="mt-3 text-sm text-warn">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-deep disabled:opacity-60"
        >
          {loading ? "Posting…" : "Post"}
        </button>
      </form>

      <div className="space-y-4">
        {posts === null && (
          <p className="text-sm text-ink-soft">Loading shared posts…</p>
        )}
        {posts?.length === 0 && (
          <p className="rounded-2xl border border-dashed border-line bg-surface/70 p-6 text-ink-soft">
            No posts yet. Be the first to share something useful for class.
          </p>
        )}
        {posts?.map((post) => (
          <article
            key={post.id}
            className="rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow)] sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
                  {courseLabel[post.course]}
                </p>
                <h3 className="mt-1 font-[family-name:var(--font-fraunces)] text-2xl text-ink">
                  {post.title}
                </h3>
              </div>
              {(post.authorId === currentUserId || isAdmin) && (
                <button
                  type="button"
                  onClick={() => void remove(post.id)}
                  className="rounded-lg border border-line px-2.5 py-1 text-xs text-ink-soft hover:bg-paper-deep"
                >
                  Delete
                </button>
              )}
            </div>
            <p className="mt-3 whitespace-pre-wrap text-ink-soft">{post.body}</p>
            {post.link && (
              <a
                href={post.link}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm text-accent underline"
              >
                Open link
              </a>
            )}
            <p className="mt-4 text-xs text-ink-soft">
              {post.authorName} ·{" "}
              {new Date(post.createdAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
