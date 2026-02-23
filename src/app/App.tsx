import { createSignal, onMount } from "solid-js";
import { createAdapter, resolveDataBackend, type DataBackend } from "../data/createAdapter";
import { createI18n, detectInitialLocale, parseLocale, persistLocale, SUPPORTED_LOCALES, type I18nKey } from "../i18n";
import { applyTheme, detectInitialTheme, persistTheme, type Theme } from "../theme";
import { getEnvVar } from "../config/env";
import { parseRatingInput, resolveInitFailureStatus, resolveSignInLabelKey } from "./logic";
import { AppHeader } from "./components/AppHeader";
import { EntryForm } from "./components/EntryForm";
import { StatusBanner } from "./components/StatusBanner";

export function App() {
  const initialLocale = detectInitialLocale();
  const i18n = createI18n(initialLocale);

  const [locale, setLocale] = createSignal(initialLocale);
  const [theme, setTheme] = createSignal<Theme>(detectInitialTheme());
  const [statusText, setStatusText] = createSignal(i18n.t("status.waitingForLogin"));
  const [statusIsError, setStatusIsError] = createSignal(false);
  const [isReady, setIsReady] = createSignal(false);
  const [signInEnabled, setSignInEnabled] = createSignal(false);
  const [ratingValue, setRatingValue] = createSignal("5");

  const backend: DataBackend = resolveDataBackend(getEnvVar("VITE_DATA_BACKEND"));
  const adapter = createAdapter(backend);
  const t = (key: I18nKey, vars?: Record<string, string>) => i18n.t(key, vars);

  applyTheme(theme());

  const setStatus = (text: string, isError = false): void => {
    setStatusText(text);
    setStatusIsError(isError);
  };

  const setConnectedUiState = (): void => {
    setIsReady(true);
    setSignInEnabled(false);
  };

  async function boot(): Promise<void> {
    setStatus(t("status.waitingForLogin"));

    try {
      await adapter.init();

      if (adapter.getAuthState() === "connected") {
        setConnectedUiState();
        setStatus(backend === "google" ? t("status.sessionRestored") : t("status.connected"));
        return;
      }

      setSignInEnabled(true);
      setStatus(t("status.clickSignIn", { signIn: t("auth.signIn") }));
    } catch (error) {
      console.error(error);
      const failure = resolveInitFailureStatus(backend, error);
      setStatus(t(failure.key), failure.isError);
      setSignInEnabled(false);
    }
  }

  onMount(() => {
    void boot();
  });

  const handleSignIn = async (): Promise<void> => {
    if (!adapter.requestSignIn) {
      return;
    }

    setStatus(t("status.openingGoogleLogin"));

    try {
      await adapter.requestSignIn();
      setConnectedUiState();
      setStatus(t("status.connected"));
    } catch (error) {
      console.error(error);
      setStatus(t("status.authRejected"), true);
    }
  };

  const handleSubmitRating = async (event: SubmitEvent): Promise<void> => {
    event.preventDefault();

    if (!adapter.isReady()) {
      setStatus(t("status.signInFirst"), true);
      return;
    }

    const rating = parseRatingInput(ratingValue());
    if (rating === null) {
      setStatus(t("status.invalidRating"), true);
      return;
    }

    try {
      setStatus(t("status.savingRating"));
      await adapter.appendRating({
        timestamp: new Date().toISOString(),
        rating,
      });

      setStatus(t("status.ratingSaved"));
    } catch (error) {
      console.error(error);
      setStatus(t("status.ratingSaveFailed"), true);
    }
  };

  const handleLocaleChange = (event: Event): void => {
    const select = event.currentTarget as HTMLSelectElement;
    const nextLocale = parseLocale(select.value) ?? "en";
    if (nextLocale === locale()) {
      return;
    }

    i18n.setLocale(nextLocale);
    persistLocale(nextLocale);
    setLocale(nextLocale);
  };

  const handleThemeChange = (event: Event): void => {
    const select = event.currentTarget as HTMLSelectElement;
    const nextTheme: Theme = select.value === "dark" ? "dark" : "light";
    if (nextTheme === theme()) {
      return;
    }

    applyTheme(nextTheme);
    persistTheme(nextTheme);
    setTheme(nextTheme);
  };

  return (
    <main class="shell">
      <AppHeader
        locale={locale()}
        supportedLocales={SUPPORTED_LOCALES}
        t={t}
        theme={theme()}
        isConnected={isReady()}
        showSignIn={!isReady() && signInEnabled()}
        signInLabel={t(resolveSignInLabelKey(isReady()))}
        signInDisabled={isReady() || !signInEnabled()}
        onLocaleChange={handleLocaleChange}
        onThemeChange={handleThemeChange}
        onSignIn={() => {
          void handleSignIn();
        }}
      />

      <StatusBanner text={statusText()} isError={statusIsError()} />

      <EntryForm
        stepLabel={t("form.step")}
        title={t("form.title")}
        subtitle={t("form.subtitle")}
        label={t("form.question")}
        saveLabel={t("form.save")}
        value={ratingValue()}
        onValueInput={(event) => {
          setRatingValue(event.currentTarget.value);
        }}
        onSubmit={(event) => {
          void handleSubmitRating(event);
        }}
      />
    </main>
  );
}
