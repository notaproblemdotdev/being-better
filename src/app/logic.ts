import type { DataBackend } from "../data/createAdapter";
import { MissingGoogleClientIdError } from "../data/adapters/googleDrive";
import type { MoodCheckIn } from "../data/types";
import type { I18nKey } from "../i18n";
import type { ThemePreference } from "../theme";

export type CloudWindow = "today" | "week" | "month" | "all-time";

export type CloudWord = {
  word: string;
  score: number;
};

export type IntensityMetric = "energy" | "stress" | "anxiety" | "joy";

export type IntensitySummary = {
  key: IntensityMetric;
  average: number | null;
  sampleCount: number;
};

export type FrequencySummary = {
  value: string;
  count: number;
};

export type DailyVolumePoint = {
  dayKey: string;
  dayLabel: string;
  count: number;
};

export type CheckInInsights = {
  totalCheckIns: number;
  activeDays: number;
  currentStreak: number;
  intensity: IntensitySummary[];
  dailyVolume: DailyVolumePoint[];
  topContextTags: FrequencySummary[];
  topSuggestedWords: FrequencySummary[];
};

export const PRESET_CONTEXT_TAGS = ["sleep", "work", "social", "health", "weather", "cycle"] as const;

export const SUGGESTED_WORDS = [
  "calm",
  "hopeful",
  "tired",
  "drained",
  "focused",
  "grateful",
  "overwhelmed",
  "steady",
  "joyful",
  "restless",
  "clear",
  "anxious",
] as const;

const STOPWORDS_EN = new Set(["the", "a", "an", "and", "or", "is", "are", "to", "of", "in", "on", "for", "it", "i", "you"]);
const STOPWORDS_PL = new Set(["i", "oraz", "a", "to", "na", "w", "z", "że", "się", "jest", "dla", "do"]);
const INTENSITY_KEYS: IntensityMetric[] = ["energy", "stress", "anxiety", "joy"];

export function parseIntensityInput(rawValue: string): number | null {
  const value = Number(rawValue.trim());
  if (!Number.isInteger(value) || value < 0 || value > 10) {
    return null;
  }
  return value;
}

export function shouldRefreshWeekChart(activeTab: "hello" | "entry" | "week" | "settings"): boolean {
  return activeTab === "week";
}

export function splitWords(input: string): string[] {
  return input
    .trim()
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 0);
}

export function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/[^\p{L}\p{N}'-]+/gu, "");
}

export function normalizeWordsForCloud(words: string[], locale: "en" | "pl"): string[] {
  const stopwords = locale === "pl" ? STOPWORDS_PL : STOPWORDS_EN;
  return words
    .map((word) => normalizeWord(word))
    .filter((word) => word.length > 0 && !stopwords.has(word));
}

export function getWordCloudWindowRange(window: CloudWindow, now = new Date()): { fromIso: string; toIso: string } {
  const to = new Date(now);
  const from = new Date(now);

  if (window === "today") {
    from.setHours(0, 0, 0, 0);
  } else if (window === "week") {
    from.setDate(from.getDate() - 6);
    from.setHours(0, 0, 0, 0);
  } else if (window === "month") {
    from.setDate(from.getDate() - 29);
    from.setHours(0, 0, 0, 0);
  } else {
    from.setTime(0);
  }

  return { fromIso: from.toISOString(), toIso: to.toISOString() };
}

export function buildWordCloud(checkIns: MoodCheckIn[], locale: "en" | "pl"): CloudWord[] {
  const scores = new Map<string, number>();
  for (const checkIn of checkIns) {
    const intensityValues = [checkIn.intensity.energy, checkIn.intensity.stress, checkIn.intensity.anxiety, checkIn.intensity.joy].filter(
      (value): value is number => typeof value === "number",
    );
    const intensityAverage = intensityValues.length > 0 ? intensityValues.reduce((sum, value) => sum + value, 0) / intensityValues.length : 0;
    const weight = 1 + intensityAverage / 10;
    const normalizedWords = normalizeWordsForCloud(checkIn.words, locale);
    for (const word of normalizedWords) {
      scores.set(word, (scores.get(word) ?? 0) + weight);
    }
  }

  return [...scores.entries()]
    .map(([word, score]) => ({ word, score }))
    .sort((a, b) => b.score - a.score || a.word.localeCompare(b.word));
}

export function buildCheckInInsights(checkIns: MoodCheckIn[], locale: "en" | "pl", now = new Date()): CheckInInsights {
  const dayBuckets = new Map<string, number>();
  const intensitySums = new Map<IntensityMetric, { total: number; count: number }>(
    INTENSITY_KEYS.map((key) => [key, { total: 0, count: 0 }]),
  );

  for (const checkIn of checkIns) {
    const date = new Date(checkIn.timestamp);
    if (Number.isNaN(date.getTime())) {
      continue;
    }
    const dayKey = toDayKey(startOfDay(date));
    dayBuckets.set(dayKey, (dayBuckets.get(dayKey) ?? 0) + 1);

    for (const key of INTENSITY_KEYS) {
      const value = checkIn.intensity[key];
      if (typeof value !== "number") {
        continue;
      }
      const current = intensitySums.get(key);
      if (!current) {
        continue;
      }
      current.total += value;
      current.count += 1;
    }
  }

  return {
    totalCheckIns: checkIns.length,
    activeDays: dayBuckets.size,
    currentStreak: computeCurrentStreak(dayBuckets, now),
    intensity: INTENSITY_KEYS.map((key) => {
      const metric = intensitySums.get(key);
      if (!metric || metric.count === 0) {
        return { key, average: null, sampleCount: 0 };
      }
      return { key, average: roundToOne(metric.total / metric.count), sampleCount: metric.count };
    }),
    dailyVolume: buildLastSevenDaysVolume(dayBuckets, locale, now),
    topContextTags: buildTopFrequencies(
      checkIns.flatMap((checkIn) => checkIn.contextTags),
      8,
    ),
    topSuggestedWords: buildTopFrequencies(
      checkIns.flatMap((checkIn) => checkIn.suggestedWordsUsed),
      8,
    ),
  };
}

export function resolveSignInLabelKey(isReady: boolean): "auth.connected" | "auth.signIn" {
  return isReady ? "auth.connected" : "auth.signIn";
}

export function resolveInitFailureStatus(backend: DataBackend, error: unknown): { key: I18nKey; isError: boolean } {
  if (error instanceof MissingGoogleClientIdError) {
    return { key: "status.missingClientId", isError: true };
  }

  if (backend === "indexeddb") {
    return { key: "status.indexedDbUnavailable", isError: true };
  }

  return { key: "status.googleClientInitFailed", isError: true };
}

export function nextThemePreference(preference: ThemePreference): ThemePreference {
  if (preference === "light") {
    return "dark";
  }
  if (preference === "dark") {
    return "system";
  }
  return "light";
}

function buildLastSevenDaysVolume(dayBuckets: Map<string, number>, locale: "en" | "pl", now: Date): DailyVolumePoint[] {
  const end = startOfDay(now);
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  const points: DailyVolumePoint[] = [];
  for (let i = 0; i < 7; i += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const dayKey = toDayKey(date);
    points.push({
      dayKey,
      dayLabel: date.toLocaleDateString(locale, { weekday: "short", day: "2-digit", month: "2-digit" }),
      count: dayBuckets.get(dayKey) ?? 0,
    });
  }
  return points;
}

function computeCurrentStreak(dayBuckets: Map<string, number>, now: Date): number {
  let streak = 0;
  const day = startOfDay(now);
  while (dayBuckets.has(toDayKey(day))) {
    streak += 1;
    day.setDate(day.getDate() - 1);
  }
  return streak;
}

function buildTopFrequencies(values: string[], limit: number): FrequencySummary[] {
  const counts = new Map<string, number>();
  for (const rawValue of values) {
    const value = normalizeWord(rawValue);
    if (!value) {
      continue;
    }
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
    .slice(0, limit);
}

function roundToOne(value: number): number {
  return Math.round(value * 10) / 10;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
