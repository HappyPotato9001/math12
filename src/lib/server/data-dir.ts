import fs from "fs";
import path from "path";

/**
 * Local: ./data
 * Vercel/serverless: /tmp (writable). Seeded empty; ensureAdminSeed recreates admin.
 */
export function getDataDir() {
  const dir = process.env.VERCEL
    ? path.join("/tmp", "math12-data")
    : path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
