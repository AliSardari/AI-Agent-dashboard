import type { RequestRow } from "../data/usage";
import { getModels } from "../data/usage";
import { Badge } from "./ui/Badge";
import { useI18n } from "../i18n/i18n-context";
import { useFormat } from "../i18n/useFormat";
import type { TranslationKey } from "../i18n/translations";

const STATUS_TONE = {
  success: "success",
  error: "error",
  limited: "warning",
} as const;

const STATUS_KEY: Record<RequestRow["status"], TranslationKey> = {
  success: "status.success",
  error: "status.error",
  limited: "status.limited",
};

interface Props {
  rows: RequestRow[];
  /** Hide cost/latency columns on narrow screens (used on Overview). */
  compact?: boolean;
}

export function RequestsTable({ rows, compact = false }: Props) {
  const { t } = useI18n();
  const fmt = useFormat();
  const models = getModels();

  const headCell = "px-4 py-2.5 text-start text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500";

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-100 dark:border-zinc-800">
            <th scope="col" className={headCell}>
              {t("table.model")}
            </th>
            <th scope="col" className={`${headCell} hidden sm:table-cell`}>
              {t("table.time")}
            </th>
            <th scope="col" className={headCell}>
              {t("table.tokens")}
            </th>
            <th scope="col" className={headCell}>
              {t("table.cost")}
            </th>
            <th
              scope="col"
              className={`${headCell} ${compact ? "hidden lg:table-cell" : ""}`}
            >
              {t("table.latency")}
            </th>
            <th scope="col" className={headCell}>
              {t("table.status")}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const model = models.find((entry) => entry.id === row.modelId);
            return (
              <tr
                key={row.id}
                className="border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50 dark:border-zinc-800/60 dark:hover:bg-zinc-800/40"
              >
                <td className="px-4 py-3">
                  <span className="block font-medium text-zinc-800 dark:text-zinc-100">
                    {model?.name ?? row.modelId}
                  </span>
                  <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                    {model?.provider}
                  </span>
                </td>
                <td className="hidden whitespace-nowrap px-4 py-3 text-zinc-500 dark:text-zinc-400 sm:table-cell">
                  {fmt.date(row.timestamp, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="whitespace-nowrap px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-300">
                  {fmt.compact(row.tokens)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-300">
                  {fmt.currency(row.cost)}
                </td>
                <td
                  className={`whitespace-nowrap px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-300 ${
                    compact ? "hidden lg:table-cell" : ""
                  }`}
                >
                  {fmt.ms(row.latencyMs)}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={STATUS_TONE[row.status]}>
                    <span
                      className="size-1.5 rounded-full bg-current"
                      aria-hidden
                    />
                    {t(STATUS_KEY[row.status])}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
