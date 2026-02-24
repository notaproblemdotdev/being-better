import type { AuthState, CheckInsRange, MoodCheckIn, RatingsStoreAdapter } from "../types";

const DB_NAME = "being_better";
const DB_VERSION = 2;
const STORE_NAME = "checkins";
const TIMESTAMP_INDEX = "timestampMs";

type StoredMoodCheckIn = {
  id?: number;
  timestamp: string;
  words: string[];
  suggestedWordsUsed: string[];
  intensityEnergy: number | null;
  intensityStress: number | null;
  intensityAnxiety: number | null;
  intensityJoy: number | null;
  contextTags: string[];
  timestampMs: number;
};

export class IndexedDbRatingsAdapter implements RatingsStoreAdapter {
  private ready = false;
  private authState: AuthState = "initializing";
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (!("indexedDB" in window)) {
      this.authState = "needs_login";
      throw new Error("IndexedDB is unavailable");
    }

    this.db = await openDatabase();
    this.ready = true;
    this.authState = "connected";
  }

  async appendCheckIn(entry: MoodCheckIn): Promise<void> {
    const db = this.assertReady();
    const timestampMs = new Date(entry.timestamp).getTime();
    if (!Number.isFinite(timestampMs)) {
      throw new Error("Invalid timestamp");
    }

    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.add({
      timestamp: entry.timestamp,
      words: entry.words,
      suggestedWordsUsed: entry.suggestedWordsUsed,
      intensityEnergy: entry.intensity.energy,
      intensityStress: entry.intensity.stress,
      intensityAnxiety: entry.intensity.anxiety,
      intensityJoy: entry.intensity.joy,
      contextTags: entry.contextTags,
      timestampMs,
    } satisfies StoredMoodCheckIn);

    await Promise.all([requestToPromise(request), transactionDone(tx)]);
  }

  async listCheckIns(range: CheckInsRange): Promise<MoodCheckIn[]> {
    const db = this.assertReady();
    const fromTime = new Date(range.fromIso).getTime();
    const toTime = new Date(range.toIso).getTime();
    if (!Number.isFinite(fromTime) || !Number.isFinite(toTime)) {
      return [];
    }

    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.index(TIMESTAMP_INDEX).getAll(IDBKeyRange.bound(fromTime, toTime));
    const rows = await requestToPromise(request);
    await transactionDone(tx);

    return rows
      .filter(
        (row): row is StoredMoodCheckIn =>
          Boolean(row) &&
          typeof row.timestamp === "string" &&
          Array.isArray(row.words) &&
          Array.isArray(row.suggestedWordsUsed) &&
          isNullableIntensity(row.intensityEnergy) &&
          isNullableIntensity(row.intensityStress) &&
          isNullableIntensity(row.intensityAnxiety) &&
          isNullableIntensity(row.intensityJoy) &&
          Array.isArray(row.contextTags),
      )
      .map((row) => ({
        timestamp: row.timestamp,
        words: row.words.filter((word): word is string => typeof word === "string"),
        suggestedWordsUsed: row.suggestedWordsUsed.filter((word): word is string => typeof word === "string"),
        intensity: {
          energy: row.intensityEnergy,
          stress: row.intensityStress,
          anxiety: row.intensityAnxiety,
          joy: row.intensityJoy,
        },
        contextTags: row.contextTags.filter((tag): tag is string => typeof tag === "string"),
      }));
  }

  isReady(): boolean {
    return this.ready;
  }

  getAuthState(): AuthState {
    return this.authState;
  }

  private assertReady(): IDBDatabase {
    if (!this.ready || !this.db) {
      throw new Error("Adapter not ready");
    }
    return this.db;
  }
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      const store = db.objectStoreNames.contains(STORE_NAME)
        ? request.transaction?.objectStore(STORE_NAME)
        : db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });

      if (!store?.indexNames.contains(TIMESTAMP_INDEX)) {
        store?.createIndex(TIMESTAMP_INDEX, TIMESTAMP_INDEX, { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open IndexedDB"));
  });
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"));
  });
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("IndexedDB transaction failed"));
    transaction.onabort = () => reject(transaction.error ?? new Error("IndexedDB transaction aborted"));
  });
}

function isNullableIntensity(value: unknown): value is number | null {
  return value === null || (typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 10);
}
