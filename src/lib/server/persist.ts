import fs from "fs";
import path from "path";
import { MongoClient, Binary, type Db } from "mongodb";
import { getDataDir } from "./data-dir";

let clientPromise: Promise<MongoClient> | null = null;
let dbPromise: Promise<Db | null> | null = null;

function mongoUri() {
  return process.env.MONGODB_URI || process.env.DATABASE_URL || "";
}

async function getDb(): Promise<Db | null> {
  const uri = mongoUri();
  if (!uri) return null;
  if (!dbPromise) {
    dbPromise = (async () => {
      if (!clientPromise) {
        clientPromise = MongoClient.connect(uri);
      }
      const client = await clientPromise;
      return client.db(process.env.MONGODB_DB || "math12");
    })();
  }
  return dbPromise;
}

export async function readJson<T>(name: string, fallback: T): Promise<T> {
  const db = await getDb();
  if (db) {
    const doc = await db.collection("json_store").findOne({ _id: name as never });
    if (!doc || doc.data === undefined) return fallback;
    return doc.data as T;
  }

  const file = path.join(getDataDir(), name);
  if (!fs.existsSync(file)) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
    return fallback;
  }
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

export async function writeJson(name: string, data: unknown): Promise<void> {
  const db = await getDb();
  if (db) {
    await db.collection("json_store").updateOne(
      { _id: name as never },
      { $set: { data, updatedAt: new Date().toISOString() } },
      { upsert: true },
    );
    return;
  }

  const file = path.join(getDataDir(), name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export async function readBinary(name: string): Promise<Buffer | null> {
  const db = await getDb();
  if (db) {
    const doc = await db.collection("bin_store").findOne({ _id: name as never });
    if (!doc?.data) return null;
    if (doc.data instanceof Binary) return Buffer.from(doc.data.buffer);
    if (Buffer.isBuffer(doc.data)) return doc.data;
    return Buffer.from(doc.data);
  }

  const file = path.join(getDataDir(), name);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file);
}

export async function writeBinary(name: string, data: Buffer): Promise<void> {
  const db = await getDb();
  if (db) {
    await db.collection("bin_store").updateOne(
      { _id: name as never },
      {
        $set: {
          data: new Binary(data),
          updatedAt: new Date().toISOString(),
        },
      },
      { upsert: true },
    );
    return;
  }

  const file = path.join(getDataDir(), name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data);
}

export async function deleteBinary(name: string): Promise<void> {
  const db = await getDb();
  if (db) {
    await db.collection("bin_store").deleteOne({ _id: name as never });
    return;
  }

  const file = path.join(getDataDir(), name);
  if (fs.existsSync(file)) fs.unlinkSync(file);
}
