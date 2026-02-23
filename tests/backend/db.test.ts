import { expect, test } from "bun:test";
import { Database } from "bun:sqlite";
import { ensureSchema } from "../../backend/db";

test("ensureSchema creates ratings and push tables", () => {
  const db = new Database(":memory:", { strict: true });
  ensureSchema(db);

  const table = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='ratings'")
    .get() as { name?: string } | null;
  const pushTable = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='push_subscriptions'")
    .get() as { name?: string } | null;
  const index = db
    .prepare("SELECT name FROM sqlite_master WHERE type='index' AND name='idx_ratings_timestamp'")
    .get() as { name?: string } | null;

  expect(table?.name).toBe("ratings");
  expect(pushTable?.name).toBe("push_subscriptions");
  expect(index?.name).toBe("idx_ratings_timestamp");

  db.close();
});
