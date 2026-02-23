import { buildLastWeekSeries, drawWeeklyChart } from "../chart/weekly";
import { createAdapter, resolveDataBackend, type DataBackend } from "../data/createAdapter";
import { MissingGoogleClientIdError } from "../data/adapters/googleDrive";
import { createI18n, detectInitialLocale, parseLocale, persistLocale, SUPPORTED_LOCALES, toBcp47Locale, type I18nKey } from "../i18n";
import { applyTheme, detectInitialTheme, persistTheme, themeLabelKey } from "../theme";
import { getUiBindings } from "../ui/bindings";
import { renderShell } from "../ui/renderShell";
import { setStatus } from "../ui/status";

export async function bootstrap(): Promise<void> {
  const app = document.querySelector<HTMLDivElement>("#app");
  if (!app) {
    throw new Error("Missing #app container");
  }

  let currentLocale = detectInitialLocale();
  let currentTheme = detectInitialTheme();
  applyTheme(currentTheme);

  const i18n = createI18n(currentLocale);
  const t = i18n.t;

  renderShell(app, {
    locale: currentLocale,
    theme: currentTheme,
    supportedLocales: SUPPORTED_LOCALES,
    t,
  });

  const ui = getUiBindings();
  const backend: DataBackend = resolveDataBackend(import.meta.env.VITE_DATA_BACKEND);
  const adapter = createAdapter(backend);

  ui.signInBtn.addEventListener("click", async () => {
    if (!adapter.requestSignIn) {
      return;
    }

    setStatus(ui.statusEl, t("status.openingGoogleLogin"));

    try {
      await adapter.requestSignIn();
      setConnectedUiState(ui, t);
      setStatus(ui.statusEl, t("status.connected"));
    } catch (error) {
      console.error(error);
      setStatus(ui.statusEl, t("status.authRejected"), true);
    }
  });

  ui.entryTab.addEventListener("click", () => showTab(ui, "entry"));
  ui.weekTab.addEventListener("click", async () => {
    showTab(ui, "week");
    await generateWeeklyChartOnDemand();
  });

  ui.ratingForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!adapter.isReady()) {
      setStatus(ui.statusEl, t("status.signInFirst"), true);
      return;
    }

    const rawValue = ui.ratingInput.value.trim();
    const rating = Number(rawValue);

    if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
      setStatus(ui.statusEl, t("status.invalidRating"), true);
      return;
    }

    try {
      setStatus(ui.statusEl, t("status.savingRating"));
      await adapter.appendRating({
        timestamp: new Date().toISOString(),
        rating,
      });

      ui.ratingForm.reset();
      setStatus(ui.statusEl, t("status.ratingSaved"));

      if (!ui.weekView.classList.contains("hidden")) {
        await refreshWeeklyChart();
      }
    } catch (error) {
      console.error(error);
      setStatus(ui.statusEl, t("status.ratingSaveFailed"), true);
    }
  });

  ui.localeSelect.addEventListener("change", () => {
    const locale = parseLocale(ui.localeSelect.value) ?? "en";
    if (locale === currentLocale) {
      return;
    }

    currentLocale = locale;
    i18n.setLocale(locale);
    persistLocale(locale);
    applyTranslations();

    if (!ui.weekView.classList.contains("hidden")) {
      void refreshWeeklyChart();
    }
  });

  ui.themeToggleBtn.addEventListener("click", () => {
    currentTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(currentTheme);
    persistTheme(currentTheme);
    applyTranslations();

    if (!ui.weekView.classList.contains("hidden")) {
      void refreshWeeklyChart();
    }
  });

  async function boot(): Promise<void> {
    setStatus(ui.statusEl, t("status.waitingForLogin"));

    try {
      await adapter.init();

      if (adapter.getAuthState() === "connected") {
        setConnectedUiState(ui, t);
        setStatus(ui.statusEl, backend === "google" ? t("status.sessionRestored") : t("status.connected"));
        return;
      }

      ui.signInBtn.disabled = false;
      setStatus(ui.statusEl, t("status.clickSignIn", { signIn: t("auth.signIn") }));
    } catch (error) {
      console.error(error);

      if (error instanceof MissingGoogleClientIdError) {
        setStatus(ui.statusEl, t("status.missingClientId"), true);
        ui.signInBtn.disabled = true;
        return;
      }

      if (backend === "local_api") {
        setStatus(ui.statusEl, t("status.localApiUnavailable"), true);
        ui.signInBtn.disabled = true;
        return;
      }

      setStatus(ui.statusEl, t("status.googleClientInitFailed"), true);
    }
  }

  async function refreshWeeklyChart(): Promise<void> {
    if (!adapter.isReady()) {
      setStatus(ui.statusEl, t("status.signInFirst"), true);
      return;
    }

    try {
      const now = new Date();
      const toIso = now.toISOString();
      const from = new Date(now);
      from.setDate(from.getDate() - 6);
      from.setHours(0, 0, 0, 0);

      const rows = await adapter.listRatings({
        fromIso: from.toISOString(),
        toIso,
      });

      const points = buildLastWeekSeries(rows, toBcp47Locale(currentLocale), now);
      drawWeeklyChart(ui.chartCanvas, ui.chartEmpty, points);
    } catch (error) {
      console.error(error);
      setStatus(ui.statusEl, t("status.chartLoadFailed"), true);
    }
  }

  async function generateWeeklyChartOnDemand(): Promise<void> {
    if (!adapter.isReady()) {
      setStatus(ui.statusEl, t("status.signInFirst"), true);
      return;
    }

    setStatus(ui.statusEl, t("status.generatingChart"));
    await refreshWeeklyChart();
    setStatus(ui.statusEl, t("status.chartUpdated"));
  }

  function applyTranslations(): void {
    ui.titleEl.textContent = t("app.title");
    ui.localeLabel.textContent = t("locale.label");
    ui.tabsEl.setAttribute("aria-label", t("tabs.ariaLabel"));
    ui.entryTab.textContent = t("tabs.entry");
    ui.weekTab.textContent = t("tabs.week");
    ui.ratingLabel.textContent = t("form.question");
    ui.saveRatingBtn.textContent = t("form.save");
    ui.chartTitle.textContent = t("chart.title");
    ui.chartCanvas.setAttribute("aria-label", t("chart.ariaLabel"));
    ui.chartEmpty.textContent = t("chart.empty");
    ui.themeToggleBtn.textContent = t("theme.toggle", { theme: t(themeLabelKey(currentTheme)) });

    if (adapter.isReady()) {
      ui.signInBtn.textContent = t("auth.connected");
    } else {
      ui.signInBtn.textContent = t("auth.signIn");
    }
  }

  void boot();
}

function setConnectedUiState(ui: ReturnType<typeof getUiBindings>, t: (key: I18nKey, vars?: Record<string, string>) => string): void {
  ui.entryTab.disabled = false;
  ui.weekTab.disabled = false;
  ui.signInBtn.textContent = t("auth.connected");
  ui.signInBtn.disabled = true;
}

function showTab(ui: ReturnType<typeof getUiBindings>, tab: "entry" | "week"): void {
  const isEntry = tab === "entry";
  ui.entryView.classList.toggle("hidden", !isEntry);
  ui.weekView.classList.toggle("hidden", isEntry);
  ui.entryTab.classList.toggle("tab-active", isEntry);
  ui.weekTab.classList.toggle("tab-active", !isEntry);
}
