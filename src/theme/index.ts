import { readCookie, setCookie } from "../session/cookies";

export type Theme = "light" | "dark";

const THEME_COOKIE_NAME = "being_better_theme";
const SUPPORTED_THEMES: Theme[] = ["light", "dark"];

export function detectInitialTheme(): Theme {
  const cookieTheme = parseTheme(readCookie(THEME_COOKIE_NAME) ?? "");
  if (cookieTheme) {
    return cookieTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function parseTheme(value: string): Theme | null {
  return (SUPPORTED_THEMES as string[]).includes(value) ? (value as Theme) : null;
}

export function persistTheme(theme: Theme): void {
  setCookie(THEME_COOKIE_NAME, theme, 31536000);
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}

export function themeLabelKey(theme: Theme): "theme.light" | "theme.dark" {
  return theme === "light" ? "theme.light" : "theme.dark";
}
