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

const STORE_KEY = "math12-class-store-v1";

function emptyStore(): Store {
  return { rooms: [], members: [], posts: [], comments: [] };
}

function readStore(): Store {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return emptyStore();
    return JSON.parse(raw) as Store;
  } catch {
    return emptyStore();
  }
}

function writeStore(store: Store) {
  window.localStorage.setItem(STORE_KEY, JSON.stringify(store));
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
  const store = readStore();
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
  const store = readStore();
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;

  let room = store.rooms.find((item) => item.code === normalized);
  if (!room) {
    // Same code on another browser starts a local room shell so classmates can
    // still use one shared code on a lab computer / after importing room data.
    room = {
      code: normalized,
      name: `Room ${normalized}`,
      createdAt: new Date().toISOString(),
    };
    store.rooms.push(room);
  }

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
  const store = readStore();
  return store.rooms.find((room) => room.code === code.toUpperCase()) ?? null;
}

export function listPosts(roomCode: string) {
  const store = readStore();
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
  const store = readStore();
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
  const store = readStore();
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
  const store = readStore();
  const post = store.posts.find(
    (item) =>
      item.id === input.postId && item.roomCode === input.roomCode.toUpperCase(),
  );
  const member = store.members.find((item) => item.id === input.authorId);
  if (!post || !member || member.roomCode !== post.roomCode) {
    return null;
  }
  if (!input.body.trim()) return null;
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

export function exportRoomData(roomCode: string) {
  const store = readStore();
  const code = roomCode.toUpperCase();
  return {
    room: store.rooms.find((room) => room.code === code) ?? null,
    members: store.members.filter((member) => member.roomCode === code),
    posts: store.posts.filter((post) => post.roomCode === code),
    comments: store.comments.filter((comment) =>
      store.posts.some(
        (post) => post.id === comment.postId && post.roomCode === code,
      ),
    ),
  };
}

export function importRoomData(payload: {
  room: Room | null;
  members: Member[];
  posts: Post[];
  comments: Comment[];
}) {
  if (!payload.room) return false;
  const store = readStore();
  const code = payload.room.code.toUpperCase();
  store.rooms = [
    ...store.rooms.filter((room) => room.code !== code),
    { ...payload.room, code },
  ];
  store.members = [
    ...store.members.filter((member) => member.roomCode !== code),
    ...payload.members,
  ];
  store.posts = [
    ...store.posts.filter((post) => post.roomCode !== code),
    ...payload.posts,
  ];
  const postIds = new Set(payload.posts.map((post) => post.id));
  store.comments = [
    ...store.comments.filter((comment) => !postIds.has(comment.postId)),
    ...payload.comments,
  ];
  writeStore(store);
  return true;
}
