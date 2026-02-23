import { BrowserStorageRatingsAdapter } from "./adapters/browserStorage";
import { GoogleDriveRatingsAdapter } from "./adapters/googleDrive";
import { getEnvVar } from "../config/env";
import type { RatingsStoreAdapter } from "./types";

export type DataBackend = "google" | "browser";

export function resolveDataBackend(value: string | undefined): DataBackend {
  if (value === "browser") {
    return "browser";
  }
  return "google";
}

export function createAdapter(backend?: DataBackend): RatingsStoreAdapter {
  const selected = backend ?? resolveDataBackend(getEnvVar("VITE_DATA_BACKEND"));

  if (selected === "browser") {
    return new BrowserStorageRatingsAdapter();
  }

  return new GoogleDriveRatingsAdapter();
}
