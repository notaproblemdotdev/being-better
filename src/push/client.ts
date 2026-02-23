import type { Locale } from "../i18n";

export type ReminderPushSettings = {
  reminderEnabled: boolean;
  reminderTime: string;
  locale: Locale;
};

export function isPushSupported(): boolean {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

export async function ensurePushSubscription(apiBaseUrl: string): Promise<PushSubscription> {
  const normalizedBaseUrl = apiBaseUrl.replace(/\/$/, "");
  const publicKeyResponse = await fetch(`${normalizedBaseUrl}/api/push/public-key`);
  if (!publicKeyResponse.ok) {
    throw new Error(`push_public_key_failed_${publicKeyResponse.status}`);
  }

  const payload = (await publicKeyResponse.json()) as { publicKey?: string };
  const publicKey = payload.publicKey ?? "";
  if (!publicKey) {
    throw new Error("missing_push_public_key");
  }

  const registration = await navigator.serviceWorker.ready;
  const existing = await registration.pushManager.getSubscription();
  if (existing) {
    return existing;
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey) as unknown as BufferSource,
  });

  return subscription;
}

export async function syncPushReminderSettings(
  apiBaseUrl: string,
  subscription: PushSubscription,
  settings: ReminderPushSettings,
): Promise<void> {
  const normalizedBaseUrl = apiBaseUrl.replace(/\/$/, "");
  const response = await fetch(`${normalizedBaseUrl}/api/push/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subscription: subscription.toJSON(),
      locale: settings.locale,
      timezoneOffsetMinutes: -new Date().getTimezoneOffset(),
      reminderEnabled: settings.reminderEnabled,
      reminderTime: settings.reminderTime,
    }),
  });

  if (!response.ok) {
    throw new Error(`push_sync_failed_${response.status}`);
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
