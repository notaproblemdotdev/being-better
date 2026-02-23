import type { Database } from "bun:sqlite";

export type PushSubscriptionInput = {
  endpoint: string;
  p256dh: string;
  auth: string;
  locale: string;
  timezoneOffsetMinutes: number;
  reminderEnabled: boolean;
  reminderTime: string;
};

export type StoredPushSubscription = PushSubscriptionInput & {
  lastSentLocalDate: string | null;
};

export class SqlitePushRepo {
  private readonly upsertStmt;
  private readonly listEnabledStmt;
  private readonly markSentStmt;

  constructor(private readonly db: Database) {
    this.upsertStmt = this.db.prepare(`
      INSERT INTO push_subscriptions (
        endpoint, p256dh, auth, locale, timezone_offset_minutes, reminder_enabled, reminder_time, last_sent_local_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NULL)
      ON CONFLICT(endpoint) DO UPDATE SET
        p256dh = excluded.p256dh,
        auth = excluded.auth,
        locale = excluded.locale,
        timezone_offset_minutes = excluded.timezone_offset_minutes,
        reminder_enabled = excluded.reminder_enabled,
        reminder_time = excluded.reminder_time
    `);
    this.listEnabledStmt = this.db.prepare(`
      SELECT endpoint, p256dh, auth, locale, timezone_offset_minutes, reminder_enabled, reminder_time, last_sent_local_date
      FROM push_subscriptions
      WHERE reminder_enabled = 1
    `);
    this.markSentStmt = this.db.prepare(`
      UPDATE push_subscriptions
      SET last_sent_local_date = ?
      WHERE endpoint = ?
    `);
  }

  upsert(input: PushSubscriptionInput): void {
    validatePushSubscriptionInput(input);
    this.upsertStmt.run(
      input.endpoint,
      input.p256dh,
      input.auth,
      input.locale,
      input.timezoneOffsetMinutes,
      input.reminderEnabled ? 1 : 0,
      input.reminderTime,
    );
  }

  listEnabled(): StoredPushSubscription[] {
    const rows = this.listEnabledStmt.all() as Array<{
      endpoint: string;
      p256dh: string;
      auth: string;
      locale: string;
      timezone_offset_minutes: number;
      reminder_enabled: number;
      reminder_time: string;
      last_sent_local_date: string | null;
    }>;

    return rows.map((row) => ({
      endpoint: row.endpoint,
      p256dh: row.p256dh,
      auth: row.auth,
      locale: row.locale,
      timezoneOffsetMinutes: row.timezone_offset_minutes,
      reminderEnabled: row.reminder_enabled === 1,
      reminderTime: row.reminder_time,
      lastSentLocalDate: row.last_sent_local_date,
    }));
  }

  markSent(endpoint: string, localDate: string): void {
    this.markSentStmt.run(localDate, endpoint);
  }
}

export function validatePushSubscriptionInput(input: PushSubscriptionInput): void {
  if (!input.endpoint || !input.p256dh || !input.auth) {
    throw new Error("Invalid subscription keys");
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.reminderTime)) {
    throw new Error("Invalid reminder time");
  }
  if (!Number.isInteger(input.timezoneOffsetMinutes) || input.timezoneOffsetMinutes < -840 || input.timezoneOffsetMinutes > 840) {
    throw new Error("Invalid timezone offset");
  }
}
