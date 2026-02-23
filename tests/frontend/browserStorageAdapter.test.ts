import { expect, test } from "bun:test";
import { BrowserStorageRatingsAdapter } from "../../src/data/adapters/browserStorage";

class InMemoryStorage {
  private readonly data = new Map<string, string>();

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
}

test("BrowserStorageRatingsAdapter stores and filters ratings", async () => {
  const storage = new InMemoryStorage();
  const adapter = new BrowserStorageRatingsAdapter({
    storage,
    storageKey: "test_ratings",
  });

  await adapter.init();
  await adapter.appendRating({ timestamp: "2026-02-20T10:00:00.000Z", rating: 6 });
  await adapter.appendRating({ timestamp: "2026-02-23T10:00:00.000Z", rating: 8 });

  const rows = await adapter.listRatings({
    fromIso: "2026-02-21T00:00:00.000Z",
    toIso: "2026-02-24T00:00:00.000Z",
  });

  expect(adapter.isReady()).toBe(true);
  expect(adapter.getAuthState()).toBe("connected");
  expect(rows).toEqual([{ timestamp: "2026-02-23T10:00:00.000Z", rating: 8 }]);
});
