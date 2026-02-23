import { readCookie, setCookie } from "../session/cookies";

export type Locale = "pl" | "en";

export type I18nKey =
  | "app.title"
  | "auth.signIn"
  | "auth.connected"
  | "status.waitingForLogin"
  | "status.missingClientId"
  | "status.clickSignIn"
  | "status.googleClientInitFailed"
  | "status.connected"
  | "status.sheetInitFailed"
  | "status.authRejected"
  | "status.oauthNotReady"
  | "status.openingGoogleLogin"
  | "status.signInFirst"
  | "status.invalidRating"
  | "status.savingRating"
  | "status.ratingSaved"
  | "status.ratingSaveFailed"
  | "status.sessionRestored"
  | "status.chartLoadFailed"
  | "status.generatingChart"
  | "status.chartUpdated"
  | "status.localApiUnavailable"
  | "tabs.ariaLabel"
  | "tabs.entry"
  | "tabs.week"
  | "form.question"
  | "form.save"
  | "chart.title"
  | "chart.ariaLabel"
  | "chart.empty"
  | "locale.label"
  | "theme.toggle"
  | "theme.light"
  | "theme.dark";

type I18nDict = Record<I18nKey, string>;
export type I18nVars = Record<string, string>;

const LOCALE_COOKIE_NAME = "being_better_locale";
export const SUPPORTED_LOCALES: Locale[] = ["pl", "en"];

const I18N: Record<Locale, I18nDict> = {
  pl: {
    "app.title": "being better",
    "auth.signIn": "Zaloguj przez Google",
    "auth.connected": "Połączono",
    "status.waitingForLogin": "Oczekiwanie na logowanie.",
    "status.missingClientId": "Ustaw VITE_GOOGLE_CLIENT_ID w środowisku (np. .env.local).",
    "status.clickSignIn": "Kliknij '{signIn}'.",
    "status.googleClientInitFailed": "Nie udało się uruchomić klienta Google API.",
    "status.connected": "Połączono z Google. Możesz zapisywać dane.",
    "status.sheetInitFailed": "Logowanie powiodło się, ale inicjalizacja arkusza nie powiodła się.",
    "status.authRejected": "Autoryzacja Google została odrzucona lub przerwana.",
    "status.oauthNotReady": "Klient OAuth nie jest gotowy.",
    "status.openingGoogleLogin": "Otwieranie logowania Google...",
    "status.signInFirst": "Najpierw zaloguj się przez Google.",
    "status.invalidRating": "Podaj liczbę całkowitą od 1 do 10.",
    "status.savingRating": "Zapisywanie oceny...",
    "status.ratingSaved": "Ocena zapisana.",
    "status.ratingSaveFailed": "Nie udało się zapisać oceny.",
    "status.sessionRestored": "Przywrócono sesję z poprzedniego logowania.",
    "status.chartLoadFailed": "Nie udało się odczytać danych do wykresu.",
    "status.generatingChart": "Generowanie wykresu z ostatniego tygodnia...",
    "status.chartUpdated": "Wykres zaktualizowany.",
    "status.localApiUnavailable": "Lokalne API jest niedostępne. Uruchom backend Bun.",
    "tabs.ariaLabel": "Widoki aplikacji",
    "tabs.entry": "Dodaj ocenę",
    "tabs.week": "Ostatni tydzień",
    "form.question": "Jak oceniasz swój dzień? 1 - bardzo zły dzień, 10 - najlepszy dzień od dawna",
    "form.save": "Zapisz ocenę",
    "chart.title": "Oceny z ostatnich 7 dni",
    "chart.ariaLabel": "Wykres ocen z ostatnich 7 dni",
    "chart.empty": "Brak danych z ostatniego tygodnia.",
    "locale.label": "Język",
    "theme.toggle": "Motyw: {theme}",
    "theme.light": "jasny",
    "theme.dark": "ciemny",
  },
  en: {
    "app.title": "being better",
    "auth.signIn": "Sign in with Google",
    "auth.connected": "Connected",
    "status.waitingForLogin": "Waiting for sign in.",
    "status.missingClientId": "Set VITE_GOOGLE_CLIENT_ID in the environment (for example, .env.local).",
    "status.clickSignIn": "Click '{signIn}'.",
    "status.googleClientInitFailed": "Failed to initialize the Google API client.",
    "status.connected": "Connected to Google. You can save data now.",
    "status.sheetInitFailed": "Sign in succeeded, but spreadsheet initialization failed.",
    "status.authRejected": "Google authorization was rejected or interrupted.",
    "status.oauthNotReady": "OAuth client is not ready.",
    "status.openingGoogleLogin": "Opening Google sign in...",
    "status.signInFirst": "Sign in with Google first.",
    "status.invalidRating": "Enter an integer between 1 and 10.",
    "status.savingRating": "Saving rating...",
    "status.ratingSaved": "Rating saved.",
    "status.ratingSaveFailed": "Failed to save rating.",
    "status.sessionRestored": "Session restored from previous sign in.",
    "status.chartLoadFailed": "Failed to load data for the chart.",
    "status.generatingChart": "Generating chart for the last week...",
    "status.chartUpdated": "Chart updated.",
    "status.localApiUnavailable": "Local API is unavailable. Start the Bun backend.",
    "tabs.ariaLabel": "App views",
    "tabs.entry": "Add rating",
    "tabs.week": "Last week",
    "form.question": "How do you rate your day? 1 - very bad day, 10 - best day in a long time",
    "form.save": "Save rating",
    "chart.title": "Ratings from the last 7 days",
    "chart.ariaLabel": "Ratings chart from the last 7 days",
    "chart.empty": "No data from the last week.",
    "locale.label": "Language",
    "theme.toggle": "Theme: {theme}",
    "theme.light": "light",
    "theme.dark": "dark",
  },
};

export function createI18n(initialLocale: Locale) {
  let currentLocale = initialLocale;

  const t = (key: I18nKey, vars?: I18nVars): string => {
    const template = I18N[currentLocale][key];
    if (!vars) {
      return template;
    }

    return template.replace(/\{(\w+)\}/g, (_, token: string) => vars[token] ?? `{${token}}`);
  };

  return {
    t,
    getLocale: () => currentLocale,
    setLocale: (locale: Locale) => {
      currentLocale = locale;
    },
  };
}

export function detectInitialLocale(): Locale {
  const cookieLocale = parseLocale(readCookie(LOCALE_COOKIE_NAME) ?? "");
  if (cookieLocale) {
    return cookieLocale;
  }

  const language = navigator.language.toLowerCase();
  if (language.startsWith("pl")) {
    return "pl";
  }
  return "en";
}

export function parseLocale(value: string): Locale | null {
  return (SUPPORTED_LOCALES as string[]).includes(value) ? (value as Locale) : null;
}

export function toBcp47Locale(locale: Locale): string {
  return locale === "pl" ? "pl-PL" : "en-US";
}

export function persistLocale(locale: Locale): void {
  setCookie(LOCALE_COOKIE_NAME, locale, 31536000);
}
