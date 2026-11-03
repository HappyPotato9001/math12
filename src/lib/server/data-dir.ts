import fs from "fs";
import path from "path";

/**
 * Local: ./data
 * Ephemeral hosts (Heroku dyno / Vercel): /tmp when no MongoDB URI is set.
 * Prefer MONGODB_URI (MongoDB Atlas via GitHub Student Pack) in production.
 */
export function getDataDir() {
  const ephemeral = Boolean(process.env.DYNO || process.env.VERCEL);
  const dir = ephemeral
    ? path.join("/tmp", "math12-data")
    : path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
