import type { TranslationKey } from "../i18n/translations";

/**
 * Locally generated demo notifications — deterministic for a given `now` so
 * tests and reloads agree. Read-state is tracked separately in the
 * useNotifications hook, keyed by the stable `id`s below.
 */

export type NotificationKind = "error" | "warning" | "success" | "info";

export type NotificationKey =
  | "errorSpike"
  | "rateLimit"
  | "budget"
  | "newModel"
  | "keyRotated"
  | "webhookFailed"
  | "latencyNormal"
  | "reportReady"
  | "deprecation";

export const NOTIFICATION_TEMPLATES: Record<
  NotificationKey,
  { titleKey: TranslationKey; bodyKey: TranslationKey }
> = {
  errorSpike: {
    titleKey: "notif.item.errorSpike",
    bodyKey: "notif.item.errorSpikeBody",
  },
  rateLimit: {
    titleKey: "notif.item.rateLimit",
    bodyKey: "notif.item.rateLimitBody",
  },
  budget: { titleKey: "notif.item.budget", bodyKey: "notif.item.budgetBody" },
  newModel: {
    titleKey: "notif.item.newModel",
    bodyKey: "notif.item.newModelBody",
  },
  keyRotated: {
    titleKey: "notif.item.keyRotated",
    bodyKey: "notif.item.keyRotatedBody",
  },
  webhookFailed: {
    titleKey: "notif.item.webhookFailed",
    bodyKey: "notif.item.webhookFailedBody",
  },
  latencyNormal: {
    titleKey: "notif.item.latencyNormal",
    bodyKey: "notif.item.latencyNormalBody",
  },
  reportReady: {
    titleKey: "notif.item.reportReady",
    bodyKey: "notif.item.reportReadyBody",
  },
  deprecation: {
    titleKey: "notif.item.deprecation",
    bodyKey: "notif.item.deprecationBody",
  },
};

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  key: NotificationKey;
  timestamp: number;
  /** Locale-neutral fields; the page formats and interpolates them. */
  model?: string;
  provider?: string;
  rate?: number;
  percent?: number;
  cost?: number;
  budget?: number;
  date?: number;
}

/** Latest notifications, newest first. */
export function getNotifications(now = Date.now()): NotificationItem[] {
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  return [
    {
      id: "n_error_spike",
      kind: "error" as const,
      key: "errorSpike" as const,
      age: 40 * minute,
      model: "Claude Opus 4",
      rate: 0.031,
    },
    {
      id: "n_rate_limit",
      kind: "warning" as const,
      key: "rateLimit" as const,
      age: 3 * hour,
      model: "GPT-4.1 mini",
      percent: 0.82,
    },
    {
      id: "n_budget",
      kind: "warning" as const,
      key: "budget" as const,
      age: 9 * hour,
      percent: 0.82,
      cost: 812.4,
      budget: 1_000,
    },
    {
      id: "n_report",
      kind: "success" as const,
      key: "reportReady" as const,
      age: 26 * hour,
    },
    {
      id: "n_new_model",
      kind: "info" as const,
      key: "newModel" as const,
      age: 2 * day,
      model: "Gemini 2.5 Flash",
    },
    {
      id: "n_key_rotated",
      kind: "info" as const,
      key: "keyRotated" as const,
      age: 3 * day,
      provider: "OpenAI",
    },
    {
      id: "n_webhook",
      kind: "error" as const,
      key: "webhookFailed" as const,
      age: 4 * day,
    },
    {
      id: "n_latency",
      kind: "success" as const,
      key: "latencyNormal" as const,
      age: 5 * day,
    },
    {
      id: "n_deprecation",
      kind: "info" as const,
      key: "deprecation" as const,
      age: 5 * day,
      model: "gpt-3.5-turbo",
      date: now + 30 * day,
    },
  ].map(({ age, ...item }) => ({ ...item, timestamp: now - age }));
}
