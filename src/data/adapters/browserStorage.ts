import type { AuthState, RatingEntry, RatingsRange, RatingsStoreAdapter } from "../types";

type StorageLike = Pick<Storage, "getItem" | "setItem">;

type BrowserStorageAdapterOptions = {
  storage?: StorageLike;
  storageKey?: string;
};

const DEFAULT_STORAGE_KEY = "being_better_ratings";

function parseEntries(raw: string | null): RatingEntry[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => item as Partial<RatingEntry>)
      .filter((item) => typeof item.timestamp === "string" && Number.isFinite(item.rating))
      .map((item) => ({ timestamp: item.timestamp as string, rating: Number(item.rating) }));
  } catch {
    return [];
  }
}

export class BrowserStorageRatingsAdapter implements RatingsStoreAdapter {
  private readonly storageKey: string;
  private storage: StorageLike | null;
  private ready = false;
  private authState: AuthState = "initializing";

  constructor(options: BrowserStorageAdapterOptions = {}) {
    this.storage = options.storage ?? null;
    this.storageKey = options.storageKey ?? DEFAULT_STORAGE_KEY;
  }

  async init(): Promise<void> {
    const storage = this.storage ?? this.resolveStorage();
    if (!storage) {
      this.authState = "needs_login";
      throw new Error("Browser storage is unavailable");
    }

    this.storage = storage;
    this.ready = true;
    this.authState = "connected";
  }

  async appendRating(entry: RatingEntry): Promise<void> {
    const storage = this.assertStorage();
    const current = parseEntries(storage.getItem(this.storageKey));
    current.push(entry);
    storage.setItem(this.storageKey, JSON.stringify(current));
  }

  async listRatings(range: RatingsRange): Promise<RatingEntry[]> {
    const storage = this.assertStorage();
    const fromTime = new Date(range.fromIso).getTime();
    const toTime = new Date(range.toIso).getTime();
    const entries = parseEntries(storage.getItem(this.storageKey));

    return entries.filter((entry) => {
      const rowTime = new Date(entry.timestamp).getTime();
      return Number.isFinite(rowTime) && rowTime >= fromTime && rowTime <= toTime;
    });
  }

  isReady(): boolean {
    return this.ready;
  }

  getAuthState(): AuthState {
    return this.authState;
  }

  private resolveStorage(): StorageLike | null {
    if (typeof globalThis.localStorage === "undefined") {
      return null;
    }
    return globalThis.localStorage;
  }

  private assertStorage(): StorageLike {
    if (!this.storage || !this.ready) {
      throw new Error("Adapter not ready");
    }
    return this.storage;
  }
}
