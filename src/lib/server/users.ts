import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { nanoid } from "nanoid";
import { readJson, writeJson } from "./persist";

export type UserStatus = "pending" | "approved" | "rejected";
export type UserRole = "student" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  status: UserStatus;
  role: UserRole;
  createdAt: string;
  provider?: "credentials" | "google" | "github";
};

export type PublicUser = Omit<User, "passwordHash">;

type Store = { users: User[] };

const STORE = "users.json";

function emptyStore(): Store {
  return { users: [] };
}

async function ensureStore(): Promise<Store> {
  return readJson<Store>(STORE, emptyStore());
}

async function writeStore(store: Store) {
  await writeJson(STORE, store);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt, 64);
  const prev = Buffer.from(hash, "hex");
  if (next.length !== prev.length) return false;
  return timingSafeEqual(next, prev);
}

function adminEmails() {
  const configured = [
    process.env.ADMIN_EMAIL,
    ...(process.env.ADMIN_EMAILS?.split(",") || []),
  ];
  return new Set(
    [
      "admin@math12.local",
      "yuii30@ausdk12.org",
      ...configured,
    ]
      .filter(Boolean)
      .map((email) => normalizeEmail(email as string)),
  );
}

export function toPublicUser(user: User): PublicUser {
  const { passwordHash, ...rest } = user;
  void passwordHash;
  return rest;
}

export async function ensureAdminSeed() {
  const store = await ensureStore();
  const emails = adminEmails();
  const adminPassword = process.env.ADMIN_PASSWORD || "changeme";
  let changed = false;
  for (const email of emails) {
    const existing = store.users.find((user) => user.email === email);
    if (existing) {
      if (existing.role !== "admin" || existing.status !== "approved") {
        existing.role = "admin";
        existing.status = "approved";
        changed = true;
      }
      continue;
    }
    store.users.push({
      id: nanoid(12),
      name: "Admin",
      email,
      passwordHash: hashPassword(adminPassword),
      status: "approved",
      role: "admin",
      provider: "credentials",
      createdAt: new Date().toISOString(),
    });
    changed = true;
  }
  if (changed) await writeStore(store);
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  await ensureAdminSeed();
  const store = await ensureStore();
  const email = normalizeEmail(input.email);
  if (!email || !input.password || input.password.length < 6) {
    throw new Error("Use a valid email and a password with at least 6 characters.");
  }
  if (store.users.some((user) => user.email === email)) {
    throw new Error("An account with that email already exists.");
  }
  const isAdmin = adminEmails().has(email);
  const user: User = {
    id: nanoid(12),
    name: input.name.trim() || "Student",
    email,
    passwordHash: hashPassword(input.password),
    status: isAdmin ? "approved" : "pending",
    role: isAdmin ? "admin" : "student",
    provider: "credentials",
    createdAt: new Date().toISOString(),
  };
  store.users.push(user);
  await writeStore(store);
  return toPublicUser(user);
}

export async function upsertOAuthUser(input: {
  email: string;
  name?: string | null;
  provider: "google" | "github";
}) {
  await ensureAdminSeed();
  const store = await ensureStore();
  const email = normalizeEmail(input.email);
  if (!email) {
    throw new Error("OAuth account is missing an email.");
  }
  const existing = store.users.find((user) => user.email === email);
  if (existing) {
    if (!existing.provider) {
      existing.provider = input.provider;
      await writeStore(store);
    }
    return toPublicUser(existing);
  }
  const isAdmin = adminEmails().has(email);
  const user: User = {
    id: nanoid(12),
    name: input.name?.trim() || email.split("@")[0] || "Student",
    email,
    status: isAdmin ? "approved" : "pending",
    role: isAdmin ? "admin" : "student",
    provider: input.provider,
    createdAt: new Date().toISOString(),
  };
  store.users.push(user);
  await writeStore(store);
  return toPublicUser(user);
}

export async function authenticateUser(email: string, password: string) {
  await ensureAdminSeed();
  const store = await ensureStore();
  const user = store.users.find(
    (item) => item.email === normalizeEmail(email),
  );
  if (!user?.passwordHash || !verifyPassword(password, user.passwordHash)) {
    return null;
  }
  return toPublicUser(user);
}

export async function getUserById(id: string) {
  await ensureAdminSeed();
  const user = (await ensureStore()).users.find((item) => item.id === id);
  return user ? toPublicUser(user) : null;
}

export async function getUserByEmail(email: string) {
  await ensureAdminSeed();
  const user = (await ensureStore()).users.find(
    (item) => item.email === normalizeEmail(email),
  );
  return user ? toPublicUser(user) : null;
}

export async function listUsers() {
  await ensureAdminSeed();
  return (await ensureStore())
    .users.map(toPublicUser)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function setUserStatus(userId: string, status: UserStatus) {
  const store = await ensureStore();
  const user = store.users.find((item) => item.id === userId);
  if (!user) return null;
  if (user.role === "admin" && status !== "approved") {
    throw new Error("Admin accounts must stay approved.");
  }
  user.status = status;
  await writeStore(store);
  return toPublicUser(user);
}
