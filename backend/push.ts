import webpush from "web-push";
import type { SqlitePushRepo, StoredPushSubscription } from "./repo/sqlitePushRepo";

type PushDeps = {
  repo: SqlitePushRepo;
};

type PushConfig = {
  publicKey: string;
  privateKey: string;
  subject: string;
};

export function readPushConfigFromEnv(): PushConfig | null {
  const publicKey = process.env.VAPID_PUBLIC_KEY ?? "";
  const privateKey = process.env.VAPID_PRIVATE_KEY ?? "";
  const subject = process.env.VAPID_SUBJECT ?? "mailto:admin@example.com";

  if (!publicKey || !privateKey) {
    return null;
  }

  return { publicKey, privateKey, subject };
}

export function createPushScheduler(deps: PushDeps, config: PushConfig): { tick: () => Promise<void>; start: () => Timer } {
  webpush.setVapidDetails(config.subject, config.publicKey, config.privateKey);

  const tick = async (): Promise<void> => {
    const now = new Date();
    const candidates = deps.repo.listEnabled();
    for (const candidate of candidates) {
      if (!shouldSendForCandidate(now, candidate)) {
        continue;
      }

      const localDate = buildLocalDate(now, candidate.timezoneOffsetMinutes);
      const locale = candidate.locale.toLowerCase().startsWith("pl") ? "pl" : "en";
      const body =
        locale === "pl" ? "Jak minął Twój dzień? Dodaj ocenę." : "How did your day go? Add your rating.";

      try {
        await webpush.sendNotification(
          {
            endpoint: candidate.endpoint,
            keys: {
              p256dh: candidate.p256dh,
              auth: candidate.auth,
            },
          },
          JSON.stringify({
            title: "being better",
            body,
            url: "/",
          }),
          {
            TTL: 3600,
          },
        );
        deps.repo.markSent(candidate.endpoint, localDate);
      } catch (error) {
        const statusCode = (error as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          // stale subscriptions are ignored; upsert on next client visit will refresh
          deps.repo.markSent(candidate.endpoint, localDate);
          continue;
        }
      }
    }
  };

  const start = (): Timer => setInterval(() => void tick(), 60_000);

  return { tick, start };
}

function shouldSendForCandidate(now: Date, candidate: StoredPushSubscription): boolean {
  const [hourText, minuteText] = candidate.reminderTime.split(":");
  const reminderHour = Number(hourText);
  const reminderMinute = Number(minuteText);

  const localNow = new Date(now.getTime() + candidate.timezoneOffsetMinutes * 60_000);
  if (localNow.getHours() < reminderHour || (localNow.getHours() === reminderHour && localNow.getMinutes() < reminderMinute)) {
    return false;
  }

  const localDate = buildLocalDate(now, candidate.timezoneOffsetMinutes);
  return candidate.lastSentLocalDate !== localDate;
}

function buildLocalDate(now: Date, timezoneOffsetMinutes: number): string {
  const localNow = new Date(now.getTime() + timezoneOffsetMinutes * 60_000);
  const y = localNow.getUTCFullYear();
  const m = String(localNow.getUTCMonth() + 1).padStart(2, "0");
  const d = String(localNow.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
