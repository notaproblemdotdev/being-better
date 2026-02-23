import { expect, test } from "bun:test";
import { Database } from "bun:sqlite";
import { ensureSchema } from "../../backend/db";
import { SqliteRatingsRepo } from "../../backend/repo/sqliteRatingsRepo";

test("append validates and stores entries", () => {
  const db = new Database(":memory:", { strict: true });
  ensureSchema(db);
  const repo = new SqliteRatingsRepo(db);

  repo.append({ timestamp: "2026-02-23T00:00:00.000Z", rating: 7 });

  expect(() => repo.append({ timestamp: "bad", rating: 7 })).toThrow();
  expect(() => repo.append({ timestamp: "2026-02-23T00:00:00.000Z", rating: 11 })).toThrow();

  const rows = repo.list("2026-02-20T00:00:00.000Z", "2026-02-24T00:00:00.000Z");
  expect(rows).toHaveLength(1);
  expect(rows[0]).toEqual({ timestamp: "2026-02-23T00:00:00.000Z", rating: 7 });

  db.close();
});
