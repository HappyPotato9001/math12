import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const root = process.cwd();
const excludeDir = path.join(root, ".pages-exclude");
const moves = [
  {
    from: path.join(root, "src", "middleware.ts"),
    to: path.join(excludeDir, "middleware.ts"),
  },
  {
    from: path.join(root, "src", "app", "api"),
    to: path.join(excludeDir, "api"),
  },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function stashPath(from, to) {
  if (!fs.existsSync(from)) return false;
  ensureDir(path.dirname(to));
  if (fs.existsSync(to)) fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
  fs.rmSync(from, { recursive: true, force: true });
  return true;
}

function restorePath(from, to) {
  if (!fs.existsSync(to)) return;
  ensureDir(path.dirname(from));
  if (fs.existsSync(from)) fs.rmSync(from, { recursive: true, force: true });
  fs.cpSync(to, from, { recursive: true });
  fs.rmSync(to, { recursive: true, force: true });
}

const moved = [];

function restore() {
  for (const item of [...moved].reverse()) {
    restorePath(item.from, item.to);
  }
  moved.length = 0;
}

process.on("exit", restore);
process.on("SIGINT", () => {
  restore();
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  console.error(err);
  restore();
  process.exit(1);
});

ensureDir(excludeDir);
for (const item of moves) {
  if (stashPath(item.from, item.to)) moved.push(item);
}

const nextDir = path.join(root, ".next");
if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
}

const result = spawnSync(
  process.platform === "win32" ? "npm.cmd" : "npm",
  ["run", "build"],
  {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_PUBLIC_STATIC_EXPORT: "1",
      NEXT_PUBLIC_BASE_PATH: "/math12",
    },
    shell: process.platform === "win32",
  },
);

restore();
process.exit(result.status ?? 1);
