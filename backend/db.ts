import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { Database } from "bun:sqlite";

export function createDatabase(path = process.env.SQLITE_PATH ?? "./data/being-better.sqlite"): Database {
  mkdirSync(dirname(path), { recursive: true });
  const db = new Database(path, { create: true, strict: true });
  ensureSchema(db);
  return db;
}

export function ensureSchema(db: Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10)
    );

    CREATE INDEX IF NOT EXISTS idx_ratings_timestamp ON ratings(timestamp);
  `);
}
