import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Check,
  Info,
  CheckCircle2,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { SegmentedControl } from "../components/ui/Controls";
import { EmptyState } from "../components/ui/Feedback";
import { NOTIFICATION_TEMPLATES } from "../data/notifications";
import {
  useNotifications,
  type ReadNotification,
} from "../hooks/useNotifications";
import { useI18n } from "../i18n/i18n-context";
import { useFormat } from "../i18n/useFormat";

type Filter = "all" | "unread";

const KIND_ICON = {
  error: AlertTriangle,
  warning: Check,
  success: CheckCircle2,
  info: Info,
} as const;

const KIND_TONE = {
  error: "text-rose-500 bg-rose-500/10",
  warning: "text-amber-500 bg-amber-500/10",
  success: "text-emerald-500 bg-emerald-500/10",
  info: "text-brand-500 bg-brand-500/10",
} as const;

function paramsFor(
  item: ReadNotification,
  fmt: ReturnType<typeof useFormat>,
): Record<string, string> {
  switch (item.key) {
    case "errorSpike":
      return { model: item.model ?? "", rate: fmt.percent(item.rate ?? 0) };
    case "rateLimit":
      return {
        model: item.model ?? "",
        percent: fmt.percent(item.percent ?? 0, 0),
      };
    case "budget":
      return {
        percent: fmt.percent(item.percent ?? 0, 0),
        cost: fmt.currency(item.cost ?? 0),
        budget: fmt.currency(item.budget ?? 0),
      };
    case "newModel":
      return { model: item.model ?? "" };
    case "keyRotated":
      return { provider: item.provider ?? "" };
    case "deprecation":
      return {
        model: item.model ?? "",
        date: item.date ? fmt.date(item.date) : "",
      };
    default:
      return {};
  }
}

export function Notifications() {
  const { t } = useI18n();
  const fmt = useFormat();
  const { items, unread, markRead, markAllRead } = useNotifications();
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(
    () => (filter === "unread" ? items.filter((i) => !i.read) : items),
    [items, filter],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t("notif.title")}
            {unread > 0 ? (
              <span className="ms-2 align-middle text-xs font-medium text-brand-600 dark:text-brand-300">
                {t("notif.unreadCount", { count: String(unread) })}
              </span>
            ) : null}
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {t("notif.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SegmentedControl
            ariaLabel={t("notif.title")}
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: t("notif.filterAll") },
              { value: "unread", label: t("notif.filterUnread") },
            ]}
          />
          <button
            type="button"
            onClick={markAllRead}
            disabled={unread === 0}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {t("notif.markAllRead")}
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Bell size={20} />}
            title={t("notif.empty.title")}
            description={t("notif.empty.hint")}
          />
        </Card>
      ) : (
        <ul className="space-y-2.5">
          {visible.map((item) => {
            const Icon = KIND_ICON[item.kind];
            const params = paramsFor(item, fmt);
            const template = NOTIFICATION_TEMPLATES[item.key];
            return (
              <li key={item.id}>
                <Card
                  className="flex items-start gap-3.5 p-4 transition-opacity"
                >
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${KIND_TONE[item.kind]}`}
                  >
                    <Icon size={16} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p
                        className={`text-sm font-medium ${
                          item.read ? "text-zinc-600 dark:text-zinc-400" : "text-zinc-900 dark:text-zinc-50"
                        }`}
                      >
                        {t(template.titleKey, params)}
                        {!item.read ? (
                          <span className="ms-2 inline-block size-1.5 translate-y-[-1px] rounded-full bg-brand-500 align-middle" />
                        ) : null}
                      </p>
                      <time className="shrink-0 text-xs tabular-nums text-zinc-400 dark:text-zinc-500">
                        {fmt.relative(item.timestamp, Date.now())}
                      </time>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                      {t(template.bodyKey, params)}
                    </p>
                    {!item.read ? (
                      <button
                        type="button"
                        onClick={() => markRead(item.id)}
                        className="mt-2 text-xs font-medium text-brand-600 transition-colors hover:underline dark:text-brand-300"
                      >
                        {t("notif.markRead")}
                      </button>
                    ) : null}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
