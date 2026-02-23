import { readCookie, setCookie } from "../session/cookies";

export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

const THEME_COOKIE_NAME = "being_better_theme_preference";
const SUPPORTED_THEME_PREFERENCES: ThemePreference[] = ["light", "dark", "system"];

export function detectInitialThemePreference(): ThemePreference {
  const cookieTheme = parseThemePreference(readCookie(THEME_COOKIE_NAME) ?? "");
  if (cookieTheme) {
    return cookieTheme;
  }

  return "system";
}

export function parseThemePreference(value: string): ThemePreference | null {
  return (SUPPORTED_THEME_PREFERENCES as string[]).includes(value) ? (value as ThemePreference) : null;
}

export function resolveThemeFromPreference(preference: ThemePreference): Theme {
  if (preference === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return preference;
}

export function persistThemePreference(preference: ThemePreference): void {
  setCookie(THEME_COOKIE_NAME, preference, 31536000);
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}

export function themePreferenceLabelKey(preference: ThemePreference): "theme.light" | "theme.dark" | "theme.system" {
  if (preference === "system") {
    return "theme.system";
  }
  return preference === "light" ? "theme.light" : "theme.dark";
}
