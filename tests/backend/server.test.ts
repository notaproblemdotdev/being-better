import { expect, test } from "bun:test";
import { Database } from "bun:sqlite";
import { ensureSchema } from "../../backend/db";
import { SqlitePushRepo } from "../../backend/repo/sqlitePushRepo";
import { SqliteRatingsRepo } from "../../backend/repo/sqliteRatingsRepo";
import { createHandler } from "../../backend/server";

test("API routes return expected status codes and payloads", async () => {
  const db = new Database(":memory:", { strict: true });
  ensureSchema(db);
  const repo = new SqliteRatingsRepo(db);
  const pushRepo = new SqlitePushRepo(db);
  const handler = createHandler({ repo, pushRepo, pushPublicKey: "test-public-key" });

  const health = await handler(new Request("http://localhost/api/health"));
  expect(health.status).toBe(200);

  const create = await handler(
    new Request("http://localhost/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timestamp: "2026-02-23T00:00:00.000Z", rating: 9 }),
    }),
  );
  expect(create.status).toBe(201);

  const list = await handler(new Request("http://localhost/api/ratings?from=2026-02-20T00:00:00.000Z&to=2026-02-24T00:00:00.000Z"));
  expect(list.status).toBe(200);
  const payload = (await list.json()) as { items: Array<{ timestamp: string; rating: number }> };
  expect(payload.items).toHaveLength(1);

  const invalid = await handler(
    new Request("http://localhost/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timestamp: "bad", rating: 99 }),
    }),
  );
  expect(invalid.status).toBe(400);

  const pushKey = await handler(new Request("http://localhost/api/push/public-key"));
  expect(pushKey.status).toBe(200);
  expect(await pushKey.json()).toEqual({ publicKey: "test-public-key" });

  db.close();
});
