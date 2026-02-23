import type { I18nKey } from "../i18n";
import type { Locale } from "../i18n";
import type { Theme } from "../theme";

type Translator = (key: I18nKey, vars?: Record<string, string>) => string;

export function renderShell(
  app: HTMLDivElement,
  options: {
    locale: Locale;
    theme: Theme;
    supportedLocales: Locale[];
    t: Translator;
  },
): void {
  const { locale, theme, supportedLocales, t } = options;

  app.innerHTML = `
    <main class="shell">
      <header class="top">
        <h1 id="title">${t("app.title")}</h1>
        <div class="top-actions">
          <label for="locale" id="locale-label" class="locale-label">${t("locale.label")}</label>
          <select id="locale" class="locale-select" aria-labelledby="locale-label">
            ${supportedLocales
              .map((item) => `<option value="${item}"${item === locale ? " selected" : ""}>${item.toUpperCase()}</option>`)
              .join("")}
          </select>
          <button id="theme-toggle" class="btn" type="button">${t("theme.toggle", { theme: t(theme === "light" ? "theme.light" : "theme.dark") })}</button>
          <button id="signin" class="btn btn-primary" disabled>${t("auth.signIn")}</button>
        </div>
      </header>

      <p id="status" class="status">${t("status.waitingForLogin")}</p>

      <nav id="tabs" class="tabs" aria-label="${t("tabs.ariaLabel")}">
        <button id="tab-entry" class="tab tab-active" disabled>${t("tabs.entry")}</button>
        <button id="tab-week" class="tab" disabled>${t("tabs.week")}</button>
      </nav>

      <section id="entry-view" class="view">
        <form id="rating-form" class="card" autocomplete="off">
          <label id="rating-label" for="rating" class="label">${t("form.question")}</label>
          <input id="rating" name="rating" type="number" min="1" max="10" step="1" required />
          <button id="save-rating" class="btn btn-primary" type="submit">${t("form.save")}</button>
        </form>
      </section>

      <section id="week-view" class="view hidden">
        <div class="card">
          <p id="chart-title" class="label">${t("chart.title")}</p>
          <canvas id="chart" width="720" height="320" aria-label="${t("chart.ariaLabel")}"></canvas>
          <p id="chart-empty" class="status hidden">${t("chart.empty")}</p>
        </div>
      </section>
    </main>
  `;
}
