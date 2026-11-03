import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

export type Room = {
  code: string;
  name: string;
  createdAt: string;
};

export type Member = {
  id: string;
  roomCode: string;
  displayName: string;
};

export type Post = {
  id: string;
  roomCode: string;
  authorId: string;
  topicPath: string;
  topicTitle: string;
  problemId: string;
  problemPrompt: string;
  workText: string;
  answer: string;
  isCorrect: boolean;
  createdAt: string;
};

export type Comment = {
  id: string;
  postId: string;
  authorId: string;
  body: string;
  createdAt: string;
};

type Store = {
  rooms: Room[];
  members: Member[];
  posts: Post[];
  comments: Comment[];
};

const dataDir = path.join(process.cwd(), "data");
const storePath = path.join(dataDir, "store.json");

function emptyStore(): Store {
  return { rooms: [], members: [], posts: [], comments: [] };
}

function ensureStore(): Store {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(storePath)) {
    const initial = emptyStore();
    fs.writeFileSync(storePath, JSON.stringify(initial, null, 2));
    return initial;
  }
  const raw = fs.readFileSync(storePath, "utf8");
  return JSON.parse(raw) as Store;
}

function writeStore(store: Store) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
}

function makeRoomCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `MATH-${suffix}`;
}

export function createRoom(name: string, displayName: string) {
  const store = ensureStore();
  let code = makeRoomCode();
  while (store.rooms.some((room) => room.code === code)) {
    code = makeRoomCode();
  }
  const room: Room = {
    code,
    name: name.trim() || "Study Room",
    createdAt: new Date().toISOString(),
  };
  const member: Member = {
    id: nanoid(10),
    roomCode: code,
    displayName: displayName.trim() || "Student",
  };
  store.rooms.push(room);
  store.members.push(member);
  writeStore(store);
  return { room, member };
}

export function joinRoom(code: string, displayName: string) {
  const store = ensureStore();
  const normalized = code.trim().toUpperCase();
  const room = store.rooms.find((item) => item.code === normalized);
  if (!room) return null;
  const member: Member = {
    id: nanoid(10),
    roomCode: room.code,
    displayName: displayName.trim() || "Student",
  };
  store.members.push(member);
  writeStore(store);
  return { room, member };
}

export function getRoom(code: string) {
  const store = ensureStore();
  return store.rooms.find((room) => room.code === code.toUpperCase()) ?? null;
}

export function getMember(memberId: string) {
  const store = ensureStore();
  return store.members.find((member) => member.id === memberId) ?? null;
}

export function listPosts(roomCode: string) {
  const store = ensureStore();
  return store.posts
    .filter((post) => post.roomCode === roomCode.toUpperCase())
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((post) => ({
      ...post,
      authorName:
        store.members.find((member) => member.id === post.authorId)?.displayName ??
        "Student",
      commentCount: store.comments.filter((comment) => comment.postId === post.id)
        .length,
    }));
}

export function getPost(roomCode: string, postId: string) {
  const store = ensureStore();
  const post = store.posts.find(
    (item) => item.id === postId && item.roomCode === roomCode.toUpperCase(),
  );
  if (!post) return null;
  const comments = store.comments
    .filter((comment) => comment.postId === post.id)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((comment) => ({
      ...comment,
      authorName:
        store.members.find((member) => member.id === comment.authorId)
          ?.displayName ?? "Student",
    }));
  return {
    ...post,
    authorName:
      store.members.find((member) => member.id === post.authorId)?.displayName ??
      "Student",
    comments,
  };
}

export function createPost(input: {
  roomCode: string;
  authorId: string;
  topicPath: string;
  topicTitle: string;
  problemId: string;
  problemPrompt: string;
  workText: string;
  answer: string;
  isCorrect: boolean;
}) {
  const store = ensureStore();
  const room = store.rooms.find(
    (item) => item.code === input.roomCode.toUpperCase(),
  );
  const member = store.members.find((item) => item.id === input.authorId);
  if (!room || !member || member.roomCode !== room.code) {
    return null;
  }
  const post: Post = {
    id: nanoid(12),
    roomCode: room.code,
    authorId: member.id,
    topicPath: input.topicPath,
    topicTitle: input.topicTitle,
    problemId: input.problemId,
    problemPrompt: input.problemPrompt,
    workText: input.workText.trim(),
    answer: input.answer.trim(),
    isCorrect: input.isCorrect,
    createdAt: new Date().toISOString(),
  };
  store.posts.unshift(post);
  writeStore(store);
  return post;
}

export function createComment(input: {
  roomCode: string;
  postId: string;
  authorId: string;
  body: string;
}) {
  const store = ensureStore();
  const post = store.posts.find(
    (item) =>
      item.id === input.postId && item.roomCode === input.roomCode.toUpperCase(),
  );
  const member = store.members.find((item) => item.id === input.authorId);
  if (!post || !member || member.roomCode !== post.roomCode) {
    return null;
  }
  const comment: Comment = {
    id: nanoid(12),
    postId: post.id,
    authorId: member.id,
    body: input.body.trim(),
    createdAt: new Date().toISOString(),
  };
  store.comments.push(comment);
  writeStore(store);
  return {
    ...comment,
    authorName: member.displayName,
  };
}
