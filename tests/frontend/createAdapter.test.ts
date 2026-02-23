import { expect, test } from "bun:test";
import { createAdapter, resolveDataBackend } from "../../src/data/createAdapter";
import { BrowserStorageRatingsAdapter } from "../../src/data/adapters/browserStorage";
import { GoogleDriveRatingsAdapter } from "../../src/data/adapters/googleDrive";

test("resolveDataBackend defaults to google", () => {
  expect(resolveDataBackend(undefined)).toBe("google");
  expect(resolveDataBackend("anything")).toBe("google");
});

test("resolveDataBackend supports browser", () => {
  expect(resolveDataBackend("browser")).toBe("browser");
});

test("createAdapter returns requested adapter", () => {
  const browser = createAdapter("browser");
  const google = createAdapter("google");

  expect(browser).toBeInstanceOf(BrowserStorageRatingsAdapter);
  expect(google).toBeInstanceOf(GoogleDriveRatingsAdapter);
});
