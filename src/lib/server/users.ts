import fs from "fs";
import path from "path";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { nanoid } from "nanoid";
import { getDataDir } from "./data-dir";

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

function storePath() {
  return path.join(getDataDir(), "users.json");
}

function emptyStore(): Store {
  return { users: [] };
}

function ensureStore(): Store {
  const file = storePath();
  if (!fs.existsSync(file)) {
    const initial = emptyStore();
    fs.writeFileSync(file, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(file, "utf8")) as Store;
}

function writeStore(store: Store) {
  fs.writeFileSync(storePath(), JSON.stringify(store, null, 2));
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

function adminEmail() {
  return normalizeEmail(process.env.ADMIN_EMAIL || "admin@math12.local");
}

export function toPublicUser(user: User): PublicUser {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}

export function ensureAdminSeed() {
  const store = ensureStore();
  const email = adminEmail();
  const adminPassword = process.env.ADMIN_PASSWORD || "changeme";
  const existing = store.users.find((user) => user.email === email);
  if (existing) {
    if (existing.role !== "admin" || existing.status !== "approved") {
      existing.role = "admin";
      existing.status = "approved";
      writeStore(store);
    }
    return;
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
  writeStore(store);
}

export function createUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  ensureAdminSeed();
  const store = ensureStore();
  const email = normalizeEmail(input.email);
  if (!email || !input.password || input.password.length < 6) {
    throw new Error("Use a valid email and a password with at least 6 characters.");
  }
  if (store.users.some((user) => user.email === email)) {
    throw new Error("An account with that email already exists.");
  }
  const isAdmin = email === adminEmail();
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
  writeStore(store);
  return toPublicUser(user);
}

export function upsertOAuthUser(input: {
  email: string;
  name?: string | null;
  provider: "google" | "github";
}) {
  ensureAdminSeed();
  const store = ensureStore();
  const email = normalizeEmail(input.email);
  if (!email) {
    throw new Error("OAuth account is missing an email.");
  }
  const existing = store.users.find((user) => user.email === email);
  if (existing) {
    if (!existing.provider) {
      existing.provider = input.provider;
      writeStore(store);
    }
    return toPublicUser(existing);
  }
  const isAdmin = email === adminEmail();
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
  writeStore(store);
  return toPublicUser(user);
}

export function authenticateUser(email: string, password: string) {
  ensureAdminSeed();
  const store = ensureStore();
  const user = store.users.find(
    (item) => item.email === normalizeEmail(email),
  );
  if (!user?.passwordHash || !verifyPassword(password, user.passwordHash)) {
    return null;
  }
  return toPublicUser(user);
}

export function getUserById(id: string) {
  ensureAdminSeed();
  const user = ensureStore().users.find((item) => item.id === id);
  return user ? toPublicUser(user) : null;
}

export function getUserByEmail(email: string) {
  ensureAdminSeed();
  const user = ensureStore().users.find(
    (item) => item.email === normalizeEmail(email),
  );
  return user ? toPublicUser(user) : null;
}

export function listUsers() {
  ensureAdminSeed();
  return ensureStore()
    .users.map(toPublicUser)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function setUserStatus(userId: string, status: UserStatus) {
  const store = ensureStore();
  const user = store.users.find((item) => item.id === userId);
  if (!user) return null;
  if (user.role === "admin" && status !== "approved") {
    throw new Error("Admin accounts must stay approved.");
  }
  user.status = status;
  writeStore(store);
  return toPublicUser(user);
}
