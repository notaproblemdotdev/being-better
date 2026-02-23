import { readCookie, setCookie } from "../session/cookies";

const REMINDER_ENABLED_COOKIE = "being_better_reminder_enabled";
const REMINDER_TIME_COOKIE = "being_better_reminder_time";
const LAST_REMINDER_LOCAL_STORAGE = "being_better_last_reminder_date";

export type ReminderSettings = {
  enabled: boolean;
  time: string;
};

const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  enabled: false,
  time: "20:00",
};

export function parseReminderTime(value: string): string | null {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : null;
}

export function detectInitialReminderSettings(): ReminderSettings {
  const enabled = readCookie(REMINDER_ENABLED_COOKIE) === "1";
  const parsedTime = parseReminderTime(readCookie(REMINDER_TIME_COOKIE) ?? "");

  return {
    enabled,
    time: parsedTime ?? DEFAULT_REMINDER_SETTINGS.time,
  };
}

export function persistReminderSettings(settings: ReminderSettings): void {
  setCookie(REMINDER_ENABLED_COOKIE, settings.enabled ? "1" : "0", 31536000);
  setCookie(REMINDER_TIME_COOKIE, settings.time, 31536000);
}

export function shouldSendDailyReminder(settings: ReminderSettings, now: Date): boolean {
  if (!settings.enabled) {
    return false;
  }

  const parsedTime = parseReminderTime(settings.time);
  if (!parsedTime) {
    return false;
  }

  const [hoursString, minutesString] = parsedTime.split(":");
  const scheduledHours = Number(hoursString);
  const scheduledMinutes = Number(minutesString);

  const reminderThreshold = new Date(now);
  reminderThreshold.setHours(scheduledHours, scheduledMinutes, 0, 0);

  if (now < reminderThreshold) {
    return false;
  }

  const todayIso = now.toISOString().slice(0, 10);
  const lastReminderDate = window.localStorage.getItem(LAST_REMINDER_LOCAL_STORAGE);

  return lastReminderDate !== todayIso;
}

export function markReminderSent(now: Date): void {
  const todayIso = now.toISOString().slice(0, 10);
  window.localStorage.setItem(LAST_REMINDER_LOCAL_STORAGE, todayIso);
}
