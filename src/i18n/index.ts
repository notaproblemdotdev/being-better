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
  | "status.wordsRequired"
  | "status.savingCheckIn"
  | "status.checkInSaved"
  | "status.checkInSaveFailed"
  | "status.cloudLoadFailed"
  | "status.sessionRestored"
  | "status.chartLoadFailed"
  | "status.generatingChart"
  | "status.chartUpdated"
  | "status.localApiUnavailable"
  | "status.indexedDbUnavailable"
  | "status.appInstalled"
  | "status.installAccepted"
  | "status.installDismissed"
  | "status.installNotAvailable"
  | "status.installUseBrowserMenu"
  | "status.installNeedsHttps"
  | "status.installIosHint"
  | "status.reminderSent"
  | "status.reminderDue"
  | "status.reminderPermissionNeeded"
  | "status.reminderPermissionGranted"
  | "status.reminderPermissionDenied"
  | "status.reminderPermissionManagedByBrowser"
  | "status.reminderNotificationsUnsupported"
  | "status.pushSetupFailed"
  | "status.pushSyncFailed"
  | "status.storageLocationUpdated"
  | "tabs.ariaLabel"
  | "tabs.entry"
  | "tabs.week"
  | "tabs.settings"
  | "menu.toggle"
  | "menu.theme"
  | "menu.account"
  | "backend.ariaLabel"
  | "backend.title"
  | "backend.description"
  | "backend.google"
  | "backend.indexedDb"
  | "backend.confirm"
  | "backend.googleHelpLabel"
  | "backend.googleHelpText"
  | "backend.indexedDbHelpLabel"
  | "backend.indexedDbHelpText"
  | "backend.storageNoteGoogle"
  | "backend.storageNoteIndexedDb"
  | "intro.title"
  | "intro.body"
  | "form.step"
  | "form.title"
  | "form.subtitle"
  | "form.question"
  | "form.words"
  | "form.wordsPlaceholder"
  | "form.wordCount"
  | "form.wordLimitHint"
  | "form.suggestedWords"
  | "form.suggestedWord.calm"
  | "form.suggestedWord.hopeful"
  | "form.suggestedWord.tired"
  | "form.suggestedWord.drained"
  | "form.suggestedWord.focused"
  | "form.suggestedWord.grateful"
  | "form.suggestedWord.overwhelmed"
  | "form.suggestedWord.steady"
  | "form.suggestedWord.joyful"
  | "form.suggestedWord.restless"
  | "form.suggestedWord.clear"
  | "form.suggestedWord.anxious"
  | "form.suggestedWord.excited"
  | "form.suggestedWord.happy"
  | "form.energy"
  | "form.stress"
  | "form.anxiety"
  | "form.joy"
  | "form.contextTags"
  | "form.contextTag.sleep"
  | "form.contextTag.work"
  | "form.contextTag.social"
  | "form.contextTag.health"
  | "form.contextTag.weather"
  | "form.contextTag.cycle"
  | "form.customTagPlaceholder"
  | "form.addTag"
  | "form.helpLabel"
  | "form.helpText"
  | "form.save"
  | "cloud.title"
  | "cloud.empty"
  | "cloud.timeframe"
  | "cloud.today"
  | "cloud.week"
  | "cloud.month"
  | "cloud.allTime"
  | "analytics.summaryTitle"
  | "analytics.totalCheckIns"
  | "analytics.activeDays"
  | "analytics.currentStreak"
  | "analytics.volumeTitle"
  | "analytics.noVolume"
  | "analytics.contextTagsTitle"
  | "analytics.suggestedWordsTitle"
  | "analytics.noTags"
  | "analytics.noSuggestedWords"
  | "chart.title"
  | "chart.ariaLabel"
  | "chart.empty"
  | "locale.label"
  | "theme.toggle"
  | "theme.light"
  | "theme.dark"
  | "theme.system"
  | "install.installApp"
  | "install.installed"
  | "footer.description"
  | "footer.terms"
  | "footer.privacy"
  | "footer.feedback"
  | "footer.github"
  | "legal.lastUpdated"
  | "legal.termsTitle"
  | "legal.privacyTitle"
  | "legal.terms.sectionUseTitle"
  | "legal.terms.sectionUseBody"
  | "legal.terms.sectionDataTitle"
  | "legal.terms.sectionDataBody"
  | "legal.terms.sectionAvailabilityTitle"
  | "legal.terms.sectionAvailabilityBody"
  | "legal.terms.sectionContactTitle"
  | "legal.terms.sectionContactBody"
  | "legal.privacy.sectionCollectedTitle"
  | "legal.privacy.sectionCollectedBody"
  | "legal.privacy.sectionUsageTitle"
  | "legal.privacy.sectionUsageBody"
  | "legal.privacy.sectionStorageTitle"
  | "legal.privacy.sectionStorageBody"
  | "legal.privacy.sectionRightsTitle"
  | "legal.privacy.sectionRightsBody"
  | "legal.privacy.sectionContactTitle"
  | "legal.privacy.sectionContactBody"
  | "settings.language"
  | "settings.defaultPreferenceHelpLabel"
  | "settings.defaultPreferenceHelpText"
  | "settings.theme"
  | "settings.storageLocation"
  | "settings.openDriveFile"
  | "settings.loggedAs"
  | "settings.reminderEnabled"
  | "settings.reminderTime"
  | "settings.reminderPermission"
  | "settings.reminderPermissionAction"
  | "settings.notificationsDefault"
  | "settings.notificationsGranted"
  | "settings.notificationsDenied"
  | "settings.notificationsUnsupported"
  | "reminder.notificationTitle"
  | "reminder.notificationBody";

type I18nDict = Record<I18nKey, string>;
export type I18nVars = Record<string, string>;

const LOCALE_COOKIE_NAME = "being_better_locale";
export const SUPPORTED_LOCALES: Locale[] = ["pl", "en"];

const I18N: Record<Locale, I18nDict> = {
  pl: {
    "app.title": "better being",
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
    "status.wordsRequired": "Wpisz przynajmniej jedno słowo o nastroju.",
    "status.savingCheckIn": "Zapisywanie check-inu...",
    "status.checkInSaved": "Check-in zapisany.",
    "status.checkInSaveFailed": "Nie udało się zapisać check-inu.",
    "status.cloudLoadFailed": "Nie udało się odczytać danych chmury słów.",
    "status.sessionRestored": "Przywrócono sesję z poprzedniego logowania.",
    "status.chartLoadFailed": "Nie udało się odczytać danych do wykresu.",
    "status.generatingChart": "Generowanie wykresu z ostatniego tygodnia...",
    "status.chartUpdated": "Wykres zaktualizowany.",
    "status.localApiUnavailable": "Lokalne API jest niedostępne. Uruchom backend Bun.",
    "status.indexedDbUnavailable": "IndexedDB jest niedostępne w tej przeglądarce.",
    "status.appInstalled": "Aplikacja jest już zainstalowana.",
    "status.installAccepted": "Instalacja rozpoczęta.",
    "status.installDismissed": "Instalacja anulowana.",
    "status.installNotAvailable": "Instalacja nie jest dostępna w tej chwili.",
    "status.installUseBrowserMenu": "Użyj menu przeglądarki i wybierz „Zainstaluj aplikację”.",
    "status.installNeedsHttps": "Instalacja wymaga HTTPS albo localhost.",
    "status.installIosHint": "Na iOS użyj Udostępnij, a potem „Do ekranu początkowego”.",
    "status.reminderSent": "Wysłano przypomnienie o podsumowaniu dnia.",
    "status.reminderDue": "Czas na podsumowanie dnia.",
    "status.reminderPermissionNeeded": "Przypomnienie jest gotowe, ale przeglądarka blokuje powiadomienia.",
    "status.reminderPermissionGranted": "Powiadomienia o przypomnieniach są włączone.",
    "status.reminderPermissionDenied": "Powiadomienia o przypomnieniach są zablokowane.",
    "status.reminderPermissionManagedByBrowser": "Aby wyłączyć powiadomienia, użyj ustawień przeglądarki dla tej strony.",
    "status.reminderNotificationsUnsupported": "Ta przeglądarka nie obsługuje powiadomień systemowych.",
    "status.pushSetupFailed": "Nie udało się skonfigurować powiadomień push.",
    "status.pushSyncFailed": "Nie udało się zapisać ustawień przypomnienia na serwerze.",
    "status.storageLocationUpdated": "Zaktualizowano miejsce zapisu danych.",
    "tabs.ariaLabel": "Widoki aplikacji",
    "tabs.entry": "Zapisz jak się czujesz",
    "tabs.week": "Ostatnie dni",
    "tabs.settings": "Ustawienia",
    "menu.toggle": "Otwórz menu",
    "menu.theme": "Motyw",
    "menu.account": "Konto",
    "backend.ariaLabel": "Wybór źródła danych",
    "backend.title": "Wybierz backend danych",
    "backend.description": "Zdecyduj, gdzie aplikacja ma zapisywać Twoje odpowiedzi.",
    "backend.google": "Twój arkusz Google na Dysku Google",
    "backend.indexedDb": "Lokalnie",
    "backend.confirm": "Potwierdź wybór",
    "backend.googleHelpLabel": "Informacje o Google Sheets",
    "backend.googleHelpText": "Zostaniesz poproszony o logowanie do konta Google, a arkusz „beingbetter” zostanie utworzony automatycznie.",
    "backend.indexedDbHelpLabel": "Informacje o IndexedDB",
    "backend.indexedDbHelpText": "Dane są zapisywane lokalnie w tej przeglądarce i na tym urządzeniu.",
    "backend.storageNoteGoogle": "Dane będą zapisywane na Twoim Dysku Google w arkuszu Google o nazwie „beingbetter”.",
    "backend.storageNoteIndexedDb": "Dane będą zapisywane lokalnie na Twoim urządzeniu, w przeglądarce.",
    "intro.title": "O aplikacji",
    "intro.body": "To aplikacja do codziennego śledzenia samopoczucia i budowania lepszych nawyków.",
    "form.step": "Krok 1",
    "form.title": "Szybki check-in nastroju",
    "form.subtitle": "Wybierz ocenę, która najlepiej oddaje dzisiejszy dzień.",
    "form.question": "Jak oceniasz swój dzień?",
    "form.words": "Jakimi słowami opiszesz ten moment?",
    "form.wordsPlaceholder": "np. spokojny, spięty, wdzięczny...",
    "form.wordCount": "Słowa: {count}/{limit}",
    "form.wordLimitHint": "Możesz zapisać więcej niż 20 słów, ale najlepiej skupić się na najważniejszych.",
    "form.suggestedWords": "Podpowiadane słowa",
    "form.suggestedWord.calm": "spokój",
    "form.suggestedWord.hopeful": "nadzieja",
    "form.suggestedWord.tired": "zmęczenie",
    "form.suggestedWord.drained": "wyczerpanie",
    "form.suggestedWord.focused": "skupienie",
    "form.suggestedWord.grateful": "wdzięczność",
    "form.suggestedWord.overwhelmed": "przytłoczenie",
    "form.suggestedWord.steady": "stabilność",
    "form.suggestedWord.joyful": "radość",
    "form.suggestedWord.restless": "niepokój",
    "form.suggestedWord.clear": "jasność",
    "form.suggestedWord.anxious": "lęk",
    "form.suggestedWord.excited": "ekscytacja",
    "form.suggestedWord.happy": "szczęście",
    "form.energy": "Energia",
    "form.stress": "Stres",
    "form.anxiety": "Lęk",
    "form.joy": "Radość",
    "form.contextTags": "Tagi kontekstu",
    "form.contextTag.sleep": "sen",
    "form.contextTag.work": "praca",
    "form.contextTag.social": "społeczne",
    "form.contextTag.health": "zdrowie",
    "form.contextTag.weather": "pogoda",
    "form.contextTag.cycle": "cykl",
    "form.customTagPlaceholder": "Dodaj własny tag",
    "form.addTag": "Dodaj",
    "form.helpLabel": "Jak odpowiedzieć",
    "form.helpText": "Nie szukaj idealnej odpowiedzi. Wybierz liczbę, która teraz wydaje się najbardziej trafna.",
    "form.save": "Zapisz check-in",
    "cloud.title": "Chmura słów nastroju",
    "cloud.empty": "Brak słów dla wybranego okresu.",
    "cloud.timeframe": "Zakres czasu",
    "cloud.today": "Ta chwila",
    "cloud.week": "Tydzień",
    "cloud.month": "Miesiąc",
    "cloud.allTime": "Cały czas",
    "analytics.summaryTitle": "Podsumowanie",
    "analytics.totalCheckIns": "Liczba check-inów",
    "analytics.activeDays": "Aktywne dni",
    "analytics.currentStreak": "Aktualna passa (dni)",
    "analytics.volumeTitle": "Aktywność z ostatnich 7 dni",
    "analytics.noVolume": "Brak check-inów z ostatnich 7 dni.",
    "analytics.contextTagsTitle": "Najczęstsze tagi kontekstu",
    "analytics.suggestedWordsTitle": "Najczęściej wybierane podpowiedzi",
    "analytics.noTags": "Brak tagów kontekstu w tym okresie.",
    "analytics.noSuggestedWords": "Brak użytych słów z podpowiedzi.",
    "chart.title": "Oceny z ostatnich 7 dni",
    "chart.ariaLabel": "Wykres ocen z ostatnich 7 dni",
    "chart.empty": "Brak danych z ostatniego tygodnia.",
    "locale.label": "Język",
    "theme.toggle": "Motyw: {theme}",
    "theme.light": "jasny",
    "theme.dark": "ciemny",
    "theme.system": "systemowy",
    "install.installApp": "Zainstaluj aplikację",
    "install.installed": "Zainstalowano",
    "footer.description": "Prosta aplikacja do codziennego check-inu samopoczucia i śledzenia trendów.",
    "footer.terms": "Regulamin",
    "footer.privacy": "Polityka prywatności",
    "footer.feedback": "Pomysł / błąd",
    "footer.github": "Zobacz na GitHubie",
    "legal.lastUpdated": "Ostatnia aktualizacja: 24 lutego 2026",
    "legal.termsTitle": "Regulamin",
    "legal.privacyTitle": "Polityka prywatności",
    "legal.terms.sectionUseTitle": "Cel aplikacji i zastrzeżenie zdrowotne",
    "legal.terms.sectionUseBody":
      "better being to narzędzie do autorefleksji i codziennych check-inów samopoczucia. Nie jest usługą medyczną i nie zapewnia diagnozy, leczenia, wsparcia kryzysowego ani profesjonalnej porady. W sytuacji zagrożenia skontaktuj się z lokalnymi służbami ratunkowymi lub licencjonowanym specjalistą.",
    "legal.terms.sectionDataTitle": "Przechowywanie danych i usługi zewnętrzne",
    "legal.terms.sectionDataBody":
      "Ty wybierasz miejsce zapisu: tryb Google (Google OAuth, Google Drive i Google Sheets) albo tryb lokalny (IndexedDB w przeglądarce). W trybie Google obowiązują także warunki i polityki Google. Po włączeniu przypomnień push subskrypcja push oraz ustawienia przypomnienia są wysyłane do skonfigurowanego backendu push.",
    "legal.terms.sectionAvailabilityTitle": "Dostępność, gwarancje i odpowiedzialność",
    "legal.terms.sectionAvailabilityBody":
      "Aplikacja jest udostępniana „as is” i może być zmieniana, wstrzymywana lub wyłączona. W maksymalnym zakresie dozwolonym przez prawo twórcy nie odpowiadają za szkody pośrednie lub następcze wynikające z używania albo braku dostępu do aplikacji. Odpowiadasz za kontrolę i kopię zapasową własnych danych.",
    "legal.terms.sectionContactTitle": "Kontakt",
    "legal.terms.sectionContactBody":
      "W pytaniach dotyczących regulaminu skontaktuj się z twórcami przez profile GitHub podane w stopce lub przez e-mail: self-trade-copious@duck.com.",
    "legal.privacy.sectionCollectedTitle": "Jakie dane są zbierane",
    "legal.privacy.sectionCollectedBody":
      "W zależności od wybranego trybu aplikacja zapisuje check-iny (czas, słowa nastroju, użyte podpowiedzi, opcjonalne skale intensywności i tagi kontekstu), ustawienia (język, motyw, przypomnienia, backend) oraz techniczne dane sesji w pamięci przeglądarki/cookie.",
    "legal.privacy.sectionUsageTitle": "W jakim celu używamy danych",
    "legal.privacy.sectionUsageBody":
      "Dane służą wyłącznie do działania funkcji aplikacji: zapisu i odczytu check-inów, obliczania trendów, stosowania ustawień, przywracania sesji i obsługi przypomnień. Nie używamy reklam ani zewnętrznej analityki.",
    "legal.privacy.sectionStorageTitle": "Gdzie dane są przechowywane",
    "legal.privacy.sectionStorageBody":
      "W trybie Google wpisy i ustawienia trafiają do Twojego arkusza „beingbetter” na Dysku Google. W trybie lokalnym wpisy pozostają w IndexedDB na urządzeniu. Jeśli skonfigurujesz backend push, metadane subskrypcji powiadomień są zapisywane w jego bazie.",
    "legal.privacy.sectionRightsTitle": "Twoja kontrola",
    "legal.privacy.sectionRightsBody":
      "Masz pełną kontrolę: możesz usuwać dane z arkusza Google, wyczyścić dane witryny w przeglądarce, cofnąć dostęp aplikacji w koncie Google oraz wyłączyć przypomnienia i powiadomienia.",
    "legal.privacy.sectionContactTitle": "Kontakt i pytania",
    "legal.privacy.sectionContactBody":
      "Jeśli masz pytania o prywatność, skontaktuj się z twórcą przez profil GitHub podany w stopce lub e-mail podany na publicznej stronie Polityki prywatności.",
    "settings.language": "Domyślny język",
    "settings.defaultPreferenceHelpLabel": "Informacja o ustawieniu domyślnym",
    "settings.defaultPreferenceHelpText":
      "To ustawienie będzie używane domyślnie na nowych urządzeniach, na których zalogujesz się tym kontem.",
    "settings.theme": "Domyślny motyw",
    "settings.storageLocation": "Miejsce zapisu danych",
    "settings.openDriveFile": "Otwórz plik na Dysku Google",
    "settings.loggedAs": "Zalogowano jako:",
    "settings.reminderEnabled": "Przypominaj o podsumowaniu dnia",
    "settings.reminderTime": "Godzina przypomnienia",
    "settings.reminderPermission": "Powiadomienia przeglądarki",
    "settings.reminderPermissionAction": "Włącz powiadomienia",
    "settings.notificationsDefault": "Brak decyzji",
    "settings.notificationsGranted": "Włączone",
    "settings.notificationsDenied": "Zablokowane",
    "settings.notificationsUnsupported": "Nieobsługiwane",
    "reminder.notificationTitle": "better being",
    "reminder.notificationBody": "Jak minął Twój dzień? Dodaj ocenę.",
  },
  en: {
    "app.title": "better being",
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
    "status.wordsRequired": "Add at least one mood word.",
    "status.savingCheckIn": "Saving check-in...",
    "status.checkInSaved": "Check-in saved.",
    "status.checkInSaveFailed": "Failed to save check-in.",
    "status.cloudLoadFailed": "Failed to load word cloud data.",
    "status.sessionRestored": "Session restored from previous sign in.",
    "status.chartLoadFailed": "Failed to load data for the chart.",
    "status.generatingChart": "Generating chart for the last week...",
    "status.chartUpdated": "Chart updated.",
    "status.localApiUnavailable": "Local API is unavailable. Start the Bun backend.",
    "status.indexedDbUnavailable": "IndexedDB is unavailable in this browser.",
    "status.appInstalled": "The app is already installed.",
    "status.installAccepted": "Installation started.",
    "status.installDismissed": "Installation was dismissed.",
    "status.installNotAvailable": "Installation is not available right now.",
    "status.installUseBrowserMenu": "Use the browser menu and choose Install app.",
    "status.installNeedsHttps": "Installation requires HTTPS or localhost.",
    "status.installIosHint": "On iOS, tap Share and then Add to Home Screen.",
    "status.reminderSent": "Sent a reminder to record today's moment.",
    "status.reminderDue": "It's time to log how your day went.",
    "status.reminderPermissionNeeded": "Reminder is due, but browser notifications are blocked.",
    "status.reminderPermissionGranted": "Reminder notifications are enabled.",
    "status.reminderPermissionDenied": "Reminder notifications are blocked.",
    "status.reminderPermissionManagedByBrowser": "To disable notifications, use your browser site settings.",
    "status.reminderNotificationsUnsupported": "This browser does not support system notifications.",
    "status.pushSetupFailed": "Failed to configure push notifications.",
    "status.pushSyncFailed": "Failed to sync reminder settings to the server.",
    "status.storageLocationUpdated": "Storage location updated.",
    "tabs.ariaLabel": "App views",
    "tabs.entry": "Record moment",
    "tabs.week": "Past week",
    "tabs.settings": "Settings",
    "menu.toggle": "Open menu",
    "menu.theme": "Theme",
    "menu.account": "Account",
    "backend.ariaLabel": "Data backend selection",
    "backend.title": "Choose a data backend",
    "backend.description": "Decide where the app should store your answers.",
    "backend.google": "Your Google Sheet on Google Drive",
    "backend.indexedDb": "On this device",
    "backend.confirm": "Confirm selection",
    "backend.googleHelpLabel": "Google Sheets info",
    "backend.googleHelpText": "You will be prompted to sign in to your Google account, and the \"beingbetter\" Google Sheet will be created.",
    "backend.indexedDbHelpLabel": "IndexedDB information",
    "backend.indexedDbHelpText": "Data is stored locally in this browser on this device.",
    "backend.storageNoteGoogle": "Data will be stored on your Google Drive in a Google Sheet called \"beingbetter\".",
    "backend.storageNoteIndexedDb": "Data will be stored locally on your device, in the browser.",
    "intro.title": "About this app",
    "intro.body": "This app helps you track daily wellbeing and (hopefully) build better habits over time.",
    "form.step": "Step 1",
    "form.title": "Mood check-in",
    "form.subtitle": "",
    "form.question": "How do you rate your day?",
    "form.words": "Describe this moment in words",
    "form.wordsPlaceholder": "for example calm, drained, hopeful...",
    "form.wordCount": "Words: {count}/{limit}",
    "form.wordLimitHint": "You can save more than 20 words, but concise entries are easier to review.",
    "form.suggestedWords": "Suggested words",
    "form.suggestedWord.calm": "calm",
    "form.suggestedWord.hopeful": "hopeful",
    "form.suggestedWord.tired": "tired",
    "form.suggestedWord.drained": "drained",
    "form.suggestedWord.focused": "focused",
    "form.suggestedWord.grateful": "grateful",
    "form.suggestedWord.overwhelmed": "overwhelmed",
    "form.suggestedWord.steady": "steady",
    "form.suggestedWord.joyful": "joyful",
    "form.suggestedWord.restless": "restless",
    "form.suggestedWord.clear": "clear",
    "form.suggestedWord.anxious": "anxious",
    "form.suggestedWord.excited": "excited",
    "form.suggestedWord.happy": "happy",
    "form.energy": "Energy",
    "form.stress": "Stress",
    "form.anxiety": "Anxiety",
    "form.joy": "Joy",
    "form.contextTags": "Context tags",
    "form.contextTag.sleep": "sleep",
    "form.contextTag.work": "work",
    "form.contextTag.social": "social",
    "form.contextTag.health": "health",
    "form.contextTag.weather": "weather",
    "form.contextTag.cycle": "cycle",
    "form.customTagPlaceholder": "Add custom tag",
    "form.addTag": "Add",
    "form.helpLabel": "How to answer",
    "form.helpText": "No need to overthink it. Pick the number that feels most accurate right now.",
    "form.save": "Save check-in",
    "cloud.title": "Mood word cloud",
    "cloud.empty": "No words for this timeframe.",
    "cloud.timeframe": "Timeframe",
    "cloud.today": "Today",
    "cloud.week": "Week",
    "cloud.month": "Month",
    "cloud.allTime": "All time",
    "analytics.summaryTitle": "Summary",
    "analytics.totalCheckIns": "Check-ins",
    "analytics.activeDays": "Active days",
    "analytics.currentStreak": "Current streak (days)",
    "analytics.volumeTitle": "Activity in the last 7 days",
    "analytics.noVolume": "No check-ins in the last 7 days.",
    "analytics.contextTagsTitle": "Top context tags",
    "analytics.suggestedWordsTitle": "Top suggested words used",
    "analytics.noTags": "No context tags in this timeframe.",
    "analytics.noSuggestedWords": "No suggested words used in this timeframe.",
    "chart.title": "Ratings from the last 7 days",
    "chart.ariaLabel": "Ratings chart from the last 7 days",
    "chart.empty": "No data from the last week.",
    "locale.label": "Language",
    "theme.toggle": "Theme: {theme}",
    "theme.light": "light",
    "theme.dark": "dark",
    "theme.system": "system",
    "install.installApp": "Install as app",
    "install.installed": "Installed",
    "footer.description": "A lightweight app for daily wellbeing check-ins and trend tracking.",
    "footer.terms": "Terms of Service",
    "footer.privacy": "Privacy Policy",
    "footer.feedback": "Feature / bug",
    "footer.github": "View on GitHub",
    "legal.lastUpdated": "Last updated: February 24, 2026",
    "legal.termsTitle": "Terms of Service",
    "legal.privacyTitle": "Privacy Policy",
    "legal.terms.sectionUseTitle": "Purpose and health disclaimer",
    "legal.terms.sectionUseBody":
      "better being is a self-reflection tool for daily wellbeing check-ins. It is not a medical service and does not provide diagnosis, treatment, crisis support, or professional advice. If you may be in danger or need clinical support, contact local emergency services or a licensed professional.",
    "legal.terms.sectionDataTitle": "Data storage and third-party services",
    "legal.terms.sectionDataBody":
      "You choose where entries are stored: Google mode (Google OAuth, Google Drive, and Google Sheets) or local mode (IndexedDB in your browser). In Google mode, your use is also subject to Google's terms and privacy policies. If push reminders are enabled, a push subscription and reminder settings are sent to the configured push backend.",
    "legal.terms.sectionAvailabilityTitle": "Availability, warranties, and liability",
    "legal.terms.sectionAvailabilityBody":
      "The app is provided \"as is\" and may change, pause, or stop at any time. To the maximum extent permitted by law, maintainers are not liable for indirect or consequential losses resulting from use of or inability to use the app. You are responsible for reviewing and backing up your own data.",
    "legal.terms.sectionContactTitle": "Contact",
    "legal.terms.sectionContactBody":
      "For Terms questions, contact the maintainers via the GitHub profiles in the footer or by email at self-trade-copious@duck.com.",
    "legal.privacy.sectionCollectedTitle": "What data is collected",
    "legal.privacy.sectionCollectedBody":
      "Depending on your selected mode, the app stores check-ins (timestamp, mood words, suggested words used, optional intensity fields, context tags), app settings (language, theme, reminders, backend), and technical session/preferences data in browser storage and cookies.",
    "legal.privacy.sectionUsageTitle": "How data is used",
    "legal.privacy.sectionUsageBody":
      "Data is used only to run app features: save and load check-ins, calculate insights, apply your settings, restore sign-in state, and handle reminders. No ads or third-party analytics are used.",
    "legal.privacy.sectionStorageTitle": "Where data is stored",
    "legal.privacy.sectionStorageBody":
      "In Google mode, entries and settings are stored in your Google Drive spreadsheet named \"beingbetter\". In local mode, entries are stored in IndexedDB on your device. If a push backend is configured, notification subscription metadata is stored there.",
    "legal.privacy.sectionRightsTitle": "Your control",
    "legal.privacy.sectionRightsBody":
      "You control your data. You can delete spreadsheet data, clear browser site data, revoke Google access for the app, and disable reminders/notifications at any time.",
    "legal.privacy.sectionContactTitle": "Contact and questions",
    "legal.privacy.sectionContactBody":
      "If you have privacy questions, contact the maintainer via the GitHub profile in the footer or the email listed on the public Privacy Policy page.",
    "settings.language": "Default language",
    "settings.defaultPreferenceHelpLabel": "Default setting information",
    "settings.defaultPreferenceHelpText":
      "This setting will be used by default on new devices where you sign in with this account.",
    "settings.theme": "Default theme",
    "settings.storageLocation": "Data storage location",
    "settings.openDriveFile": "Open file on Google Drive",
    "settings.loggedAs": "Logged as:",
    "settings.reminderEnabled": "Remind me to log my day",
    "settings.reminderTime": "Reminder time",
    "settings.reminderPermission": "Browser notifications",
    "settings.reminderPermissionAction": "Enable notifications",
    "settings.notificationsDefault": "Not decided",
    "settings.notificationsGranted": "Enabled",
    "settings.notificationsDenied": "Blocked",
    "settings.notificationsUnsupported": "Unsupported",
    "reminder.notificationTitle": "better being",
    "reminder.notificationBody": "How did your day go? Add your rating.",
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
