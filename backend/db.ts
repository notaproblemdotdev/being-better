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

    CREATE TABLE IF NOT EXISTS push_subscriptions (
      endpoint TEXT PRIMARY KEY,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      locale TEXT NOT NULL,
      timezone_offset_minutes INTEGER NOT NULL,
      reminder_enabled INTEGER NOT NULL CHECK (reminder_enabled IN (0, 1)),
      reminder_time TEXT NOT NULL,
      last_sent_local_date TEXT
    );
  `);
}
