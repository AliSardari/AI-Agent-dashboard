import { useMemo } from "react";
import { Card, CardHeader } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Skeleton, EmptyState } from "../components/ui/Feedback";
import { LatencyByModelChart } from "../components/charts/LatencyByModelChart";
import { useUsageData } from "../hooks/useUsageData";
import { getUsageByModel } from "../data/usage";
import { useI18n } from "../i18n/i18n-context";
import { useFormat } from "../i18n/useFormat";

export function Models() {
  const { t } = useI18n();
  const fmt = useFormat();
  const { status, data } = useUsageData(30);

  const usage = useMemo(
    () => (data ? getUsageByModel(30) : []),
    [data],
  );

  const latency = useMemo(
    () =>
      [...(data?.models ?? [])]
        .sort((a, b) => a.medianLatencyMs - b.medianLatencyMs)
        .map((model) => ({ name: model.name, value: model.medianLatencyMs })),
    [data],
  );

  const isLoading = status === "loading";

  if (status === "error") {
    return (
      <Card>
        <EmptyState title={t("error.title")} description={t("error.description")} />
      </Card>
    );
  }

  const headCell =
    "px-4 py-2.5 text-start text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t("models.title")}
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {t("models.subtitle")}
        </p>
      </div>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader
            title={t("chart.latencyByModel")}
            hint={t("chart.latencyByModelHint")}
            className="pb-4"
          />
          <div className="px-2 pb-4">
            {isLoading ? (
              <Skeleton className="mx-3 h-[240px]" />
            ) : (
              <LatencyByModelChart data={latency} />
            )}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader
            title={t("table.share")}
            hint={t("chart.costByModelHint")}
            className="pb-4"
          />
          <ul className="space-y-3 px-5 pb-5 pt-2">
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <li key={index}>
                    <Skeleton className="h-4 w-full" />
                  </li>
                ))
              : usage.slice(0, 6).map((row) => (
                  <li key={row.model.id}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                      <span className="truncate font-medium text-zinc-700 dark:text-zinc-200">
                        {row.model.name}
                      </span>
                      <span className="shrink-0 tabular-nums text-zinc-500 dark:text-zinc-400">
                        {fmt.currency(row.cost)} · {fmt.percent(row.model.share, 0)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cyan-400"
                        style={{ width: `${Math.round(row.model.share * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
          </ul>
        </Card>
      </section>

      <Card className="overflow-hidden">
        <CardHeader title={t("models.title")} hint={t("models.subtitle")} className="pb-3" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th scope="col" className={headCell}>
                  {t("table.model")}
                </th>
                <th scope="col" className={headCell}>
                  {t("table.provider")}
                </th>
                <th scope="col" className={headCell}>
                  {t("table.priceIn")}
                </th>
                <th scope="col" className={headCell}>
                  {t("table.priceOut")}
                </th>
                <th scope="col" className={headCell}>
                  {t("table.context")}
                </th>
                <th scope="col" className={headCell}>
                  {t("table.requestsCount")}
                </th>
                <th scope="col" className={headCell}>
                  {t("table.successRate")}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3" colSpan={7}>
                        <Skeleton className="h-5 w-full" />
                      </td>
                    </tr>
                  ))
                : (data?.models ?? []).map((model) => (
                    <tr
                      key={model.id}
                      className="border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50 dark:border-zinc-800/60 dark:hover:bg-zinc-800/40"
                    >
                      <td className="px-4 py-3">
                        <span className="block font-medium text-zinc-800 dark:text-zinc-100">
                          {model.name}
                        </span>
                        <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                          {model.id}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone="neutral">{model.provider}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-300">
                        {fmt.currency(model.inputPrice)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-300">
                        {fmt.currency(model.outputPrice)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-300">
                        {fmt.compact(model.contextWindow)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-300">
                        {fmt.compact(model.requests)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Badge
                          tone={
                            model.successRate >= 0.99
                              ? "success"
                              : model.successRate >= 0.98
                                ? "warning"
                                : "error"
                          }
                        >
                          {fmt.percent(model.successRate)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
