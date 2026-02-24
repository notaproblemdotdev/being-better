import { expect, test } from "bun:test";
import { MissingGoogleClientIdError } from "../../src/data/adapters/googleDrive";
import {
  buildCheckInInsights,
  buildWordCloud,
  getWordCloudWindowRange,
  nextThemePreference,
  normalizeWordsForCloud,
  parseIntensityInput,
  resolveInitFailureStatus,
  resolveSignInLabelKey,
  shouldRefreshWeekChart,
  splitWords,
} from "../../src/app/logic";

test("parseIntensityInput accepts only integer values from 0 to 10", () => {
  expect(parseIntensityInput("0")).toBe(0);
  expect(parseIntensityInput(" 10 ")).toBe(10);
  expect(parseIntensityInput("-1")).toBeNull();
  expect(parseIntensityInput("11")).toBeNull();
  expect(parseIntensityInput("3.5")).toBeNull();
  expect(parseIntensityInput("bad")).toBeNull();
});

test("word helpers split and normalize with stopwords", () => {
  expect(splitWords(" calm   hopeful  ")).toEqual(["calm", "hopeful"]);
  expect(normalizeWordsForCloud(["Calm!", "and", "Hopeful"], "en")).toEqual(["calm", "hopeful"]);
});

test("buildWordCloud aggregates words with intensity weighting", () => {
  const cloud = buildWordCloud(
    [
      {
        timestamp: "2026-02-23T00:00:00.000Z",
        words: ["Calm", "calm", "Focused"],
        suggestedWordsUsed: [],
        contextTags: [],
        intensity: { energy: 10, stress: 0, anxiety: 0, joy: 10 },
      },
    ],
    "en",
  );

  expect(cloud[0]?.word).toBe("calm");
  expect(cloud[0]?.score).toBe(3);
  expect(cloud[1]?.word).toBe("focused");
  expect(cloud[1]?.score).toBe(1.5);
});

test("buildCheckInInsights summarizes tracked dimensions", () => {
  const insights = buildCheckInInsights(
    [
      {
        timestamp: "2026-02-24T09:00:00.000Z",
        words: ["calm", "focused"],
        suggestedWordsUsed: ["calm"],
        contextTags: ["work"],
        intensity: { energy: 6, stress: 4, anxiety: 2, joy: 7 },
      },
      {
        timestamp: "2026-02-23T11:00:00.000Z",
        words: ["tired"],
        suggestedWordsUsed: ["tired"],
        contextTags: ["sleep", "work"],
        intensity: { energy: 4, stress: 5, anxiety: null, joy: 5 },
      },
    ],
    "en",
    new Date("2026-02-24T12:00:00.000Z"),
  );

  expect(insights.totalCheckIns).toBe(2);
  expect(insights.activeDays).toBe(2);
  expect(insights.currentStreak).toBe(2);
  expect(insights.intensity.find((metric) => metric.key === "energy")?.average).toBe(5);
  expect(insights.intensity.find((metric) => metric.key === "anxiety")?.sampleCount).toBe(1);
  expect(insights.topContextTags[0]).toEqual({ value: "work", count: 2 });
  expect(insights.topSuggestedWords[0]).toEqual({ value: "calm", count: 1 });
  expect(insights.dailyVolume).toHaveLength(7);
  expect(insights.dailyVolume[5]?.count).toBe(1);
  expect(insights.dailyVolume[6]?.count).toBe(1);
});

test("word cloud ranges include current day/week/month/all-time", () => {
  const now = new Date("2026-02-24T12:00:00.000Z");
  expect(getWordCloudWindowRange("today", now).fromIso).toBe("2026-02-24T00:00:00.000Z");
  expect(getWordCloudWindowRange("week", now).fromIso).toBe("2026-02-18T00:00:00.000Z");
  expect(getWordCloudWindowRange("month", now).fromIso).toBe("2026-01-26T00:00:00.000Z");
  expect(getWordCloudWindowRange("all-time", now).fromIso).toBe("1970-01-01T00:00:00.000Z");
});

test("week chart refresh only occurs for week tab", () => {
  expect(shouldRefreshWeekChart("hello")).toBe(false);
  expect(shouldRefreshWeekChart("entry")).toBe(false);
  expect(shouldRefreshWeekChart("week")).toBe(true);
  expect(shouldRefreshWeekChart("settings")).toBe(false);
});

test("sign in label key follows connection state", () => {
  expect(resolveSignInLabelKey(false)).toBe("auth.signIn");
  expect(resolveSignInLabelKey(true)).toBe("auth.connected");
});

test("boot failure status mapping keeps adapter-specific messaging", () => {
  expect(resolveInitFailureStatus("google", new MissingGoogleClientIdError())).toEqual({
    key: "status.missingClientId",
    isError: true,
  });

  expect(resolveInitFailureStatus("indexeddb", new Error("unsupported"))).toEqual({
    key: "status.indexedDbUnavailable",
    isError: true,
  });

  expect(resolveInitFailureStatus("google", new Error("unknown"))).toEqual({
    key: "status.googleClientInitFailed",
    isError: true,
  });
});

test("nextThemePreference cycles light, dark and system", () => {
  expect(nextThemePreference("light")).toBe("dark");
  expect(nextThemePreference("dark")).toBe("system");
  expect(nextThemePreference("system")).toBe("light");
});
