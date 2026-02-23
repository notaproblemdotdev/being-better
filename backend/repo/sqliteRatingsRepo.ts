import type { Database } from "bun:sqlite";

export type RatingEntry = {
  timestamp: string;
  rating: number;
};

export class SqliteRatingsRepo {
  private readonly insertStmt;
  private readonly listStmt;

  constructor(private readonly db: Database) {
    this.insertStmt = this.db.prepare("INSERT INTO ratings (timestamp, rating) VALUES (?, ?)");
    this.listStmt = this.db.prepare(
      "SELECT timestamp, rating FROM ratings WHERE timestamp >= ? AND timestamp <= ? ORDER BY timestamp ASC",
    );
  }

  append(entry: RatingEntry): void {
    validateEntry(entry);
    this.insertStmt.run(entry.timestamp, entry.rating);
  }

  list(fromIso: string, toIso: string): RatingEntry[] {
    if (!isIsoDate(fromIso) || !isIsoDate(toIso)) {
      throw new Error("Invalid range");
    }

    const rows = this.listStmt.all(fromIso, toIso) as Array<{ timestamp: string; rating: number }>;
    return rows.map((row) => ({ timestamp: row.timestamp, rating: row.rating }));
  }
}

export function validateEntry(entry: RatingEntry): void {
  if (!isIsoDate(entry.timestamp)) {
    throw new Error("Invalid timestamp");
  }

  if (!Number.isInteger(entry.rating) || entry.rating < 1 || entry.rating > 10) {
    throw new Error("Invalid rating");
  }
}

function isIsoDate(value: string): boolean {
  if (!value) {
    return false;
  }

  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.toISOString() === value;
}
