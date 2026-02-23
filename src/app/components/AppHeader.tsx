
import { createEffect, createSignal, onCleanup, Show, type JSX } from "solid-js";
import type { I18nKey, Locale } from "../../i18n";
import type { Theme } from "../../theme";

type Translator = (key: I18nKey, vars?: Record<string, string>) => string;

export function AppHeader(props: {
  locale: Locale;
  supportedLocales: Locale[];
  t: Translator;
  theme: Theme;
  isConnected: boolean;
  showSignIn: boolean;
  signInLabel: string;
  signInDisabled: boolean;
  onLocaleChange: JSX.EventHandler<HTMLSelectElement, Event>;
  onThemeChange: JSX.EventHandler<HTMLSelectElement, Event>;
  onSignIn: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
}): JSX.Element {
  const [menuOpen, setMenuOpen] = createSignal(false);
  let menuEl: HTMLDivElement | undefined;
  let menuButtonEl: HTMLButtonElement | undefined;

  createEffect(() => {
    if (!menuOpen()) {
      return;
    }

    const onPointerDown = (event: PointerEvent): void => {
      const target = event.target as Node | null;
      if (!target) {
        return;
      }

      if (menuEl?.contains(target) || menuButtonEl?.contains(target)) {
        return;
      }

      setMenuOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonEl?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    onCleanup(() => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    });
  });

  return (
    <header class="top">
      <div class="top-main">
        <h1 id="title">{props.t("app.title")}</h1>
        <button
          id="menu-toggle"
          class="btn menu-toggle"
          type="button"
          aria-label={props.t("menu.toggle")}
          aria-haspopup="menu"
          aria-expanded={menuOpen()}
          aria-controls="top-menu"
          ref={menuButtonEl}
          onClick={() => {
            setMenuOpen((value) => !value);
          }}
        >
          <span class="menu-line" />
          <span class="menu-line" />
          <span class="menu-line" />
        </button>
      </div>
      <Show when={menuOpen()}>
        <div
          id="top-menu"
          class="top-menu"
          role="menu"
          ref={menuEl}
        >
          <div class="menu-item">
            <span class="menu-label">{props.t("locale.label")}</span>
            <select
              id="locale"
              class="locale-select menu-select"
              value={props.locale}
              onChange={(event) => {
                props.onLocaleChange(event);
                setMenuOpen(false);
              }}
            >
              {props.supportedLocales.map((item) => (
                <option value={item}>{item.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div class="menu-item">
            <span class="menu-label">{props.t("menu.theme")}</span>
            <select
              id="theme"
              class="locale-select menu-select"
              value={props.theme}
              onChange={(event) => {
                props.onThemeChange(event);
                setMenuOpen(false);
              }}
            >
              <option value="light">{props.t("theme.light")}</option>
              <option value="dark">{props.t("theme.dark")}</option>
            </select>
          </div>

          {props.isConnected && (
            <div class="menu-item menu-status" aria-label={props.signInLabel}>
              <span class="menu-label">{props.t("menu.account")}</span>
              <span class="status-dot" aria-hidden="true" />
              <span class="menu-value">{props.signInLabel}</span>
            </div>
          )}

          {props.showSignIn && (
            <button
              id="signin"
              class="btn btn-primary btn-signin menu-primary"
              type="button"
              disabled={props.signInDisabled}
              onClick={(event) => {
                props.onSignIn(event);
                setMenuOpen(false);
              }}
            >
              {props.signInLabel}
            </button>
          )}
        </div>
      </Show>
    </header>
  );
}
