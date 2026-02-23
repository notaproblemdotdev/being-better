import type { JSX } from "solid-js";
import type { Locale } from "../../i18n";
import type { ThemePreference } from "../../theme";

export function SettingsView(props: {
  visible: boolean;
  languageLabel: string;
  themeLabel: string;
  reminderEnabledLabel: string;
  reminderTimeLabel: string;
  reminderPermissionLabel: string;
  reminderPermissionActionLabel: string;
  reminderPermissionStateLabel: string;
  themeOptionLightLabel: string;
  themeOptionDarkLabel: string;
  themeOptionSystemLabel: string;
  locale: Locale;
  supportedLocales: Locale[];
  themePreference: ThemePreference;
  reminderEnabled: boolean;
  reminderTime: string;
  showNotificationPermissionAction: boolean;
  onLocaleChange: JSX.EventHandler<HTMLSelectElement, Event>;
  onThemePreferenceChange: JSX.EventHandler<HTMLSelectElement, Event>;
  onReminderEnabledChange: JSX.EventHandler<HTMLInputElement, Event>;
  onReminderTimeChange: JSX.EventHandler<HTMLInputElement, Event>;
  onRequestReminderPermission: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
}): JSX.Element {
  return (
    <section id="settings-view" class={`view${props.visible ? "" : " hidden"}`}>
      <div class="card">
        <label for="settings-language" class="label">
          {props.languageLabel}
        </label>
        <select id="settings-language" class="locale-select" value={props.locale} onChange={props.onLocaleChange}>
          {props.supportedLocales.map((item) => (
            <option value={item}>{item.toUpperCase()}</option>
          ))}
        </select>

        <label for="settings-theme" class="label">
          {props.themeLabel}
        </label>
        <select id="settings-theme" class="locale-select" value={props.themePreference} onChange={props.onThemePreferenceChange}>
          <option value="light">{props.themeOptionLightLabel}</option>
          <option value="dark">{props.themeOptionDarkLabel}</option>
          <option value="system">{props.themeOptionSystemLabel}</option>
        </select>

        <label for="settings-reminder-enabled" class="label">
          <input
            id="settings-reminder-enabled"
            type="checkbox"
            checked={props.reminderEnabled}
            onChange={props.onReminderEnabledChange}
          />{" "}
          {props.reminderEnabledLabel}
        </label>

        <label for="settings-reminder-time" class="label">
          {props.reminderTimeLabel}
        </label>
        <input id="settings-reminder-time" type="time" value={props.reminderTime} onInput={props.onReminderTimeChange} />

        <p class="label">{props.reminderPermissionLabel}</p>
        <p class="status">{props.reminderPermissionStateLabel}</p>
        {props.showNotificationPermissionAction ? (
          <button type="button" class="btn" onClick={props.onRequestReminderPermission}>
            {props.reminderPermissionActionLabel}
          </button>
        ) : null}
      </div>
    </section>
  );
}
