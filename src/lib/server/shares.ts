import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { getDataDir } from "./data-dir";

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

function storePath() {
  return path.join(getDataDir(), "shares.json");
}

function ensureStore(): Store {
  const file = storePath();
  if (!fs.existsSync(file)) {
    const initial: Store = { posts: [] };
    fs.writeFileSync(file, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(file, "utf8")) as Store;
}

function writeStore(store: Store) {
  fs.writeFileSync(storePath(), JSON.stringify(store, null, 2));
}

export function listShares() {
  return ensureStore()
    .posts.slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createShare(input: {
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

  const store = ensureStore();
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
  writeStore(store);
  return post;
}

export function deleteShare(id: string, requester: { id: string; role: string }) {
  const store = ensureStore();
  const index = store.posts.findIndex((post) => post.id === id);
  if (index < 0) return false;
  const post = store.posts[index];
  if (post.authorId !== requester.id && requester.role !== "admin") {
    throw new Error("You can only delete your own posts.");
  }
  store.posts.splice(index, 1);
  writeStore(store);
  return true;
}
