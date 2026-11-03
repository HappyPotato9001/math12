import { nanoid } from "nanoid";
import { readJson, writeJson } from "./persist";

export type ShareCourse = "math1" | "math2" | "general";

export type SharePost = {
  id: string;
  title: string;
  body: string;
  course: ShareCourse;
  link?: string;
  authorId: string;
  authorName: string;
  createdAt: string;
};

type Store = { posts: SharePost[] };

const STORE = "shares.json";

async function ensureStore(): Promise<Store> {
  return readJson<Store>(STORE, { posts: [] });
}

async function writeStore(store: Store) {
  await writeJson(STORE, store);
}

export async function listShares() {
  return (await ensureStore())
    .posts.slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createShare(input: {
  title: string;
  body: string;
  course: ShareCourse;
  link?: string;
  authorId: string;
  authorName: string;
}) {
  const title = input.title.trim();
  const body = input.body.trim();
  if (!title || title.length > 120) {
    throw new Error("Title is required (max 120 characters).");
  }
  if (!body || body.length > 4000) {
    throw new Error("Write a short note (max 4000 characters).");
  }
  if (!["math1", "math2", "general"].includes(input.course)) {
    throw new Error("Pick a valid course tag.");
  }
  let link = input.link?.trim() || undefined;
  if (link) {
    try {
      const url = new URL(link);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("bad");
      }
      link = url.toString();
    } catch {
      throw new Error("Link must be a valid http(s) URL.");
    }
  }

  const store = await ensureStore();
  const post: SharePost = {
    id: nanoid(12),
    title,
    body,
    course: input.course,
    link,
    authorId: input.authorId,
    authorName: input.authorName,
    createdAt: new Date().toISOString(),
  };
  store.posts.unshift(post);
  await writeStore(store);
  return post;
}

export async function deleteShare(
  id: string,
  requester: { id: string; role: string },
) {
  const store = await ensureStore();
  const index = store.posts.findIndex((post) => post.id === id);
  if (index < 0) return false;
  const post = store.posts[index];
  if (post.authorId !== requester.id && requester.role !== "admin") {
    throw new Error("You can only delete your own posts.");
  }
  store.posts.splice(index, 1);
  await writeStore(store);
  return true;
}
