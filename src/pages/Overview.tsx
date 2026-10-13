import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Coins,
  Gauge,
  ListChecks,
  RefreshCw,
  TriangleAlert,
  Zap,
} from "lucide-react";
import { Card, CardHeader } from "../components/ui/Card";
import { SegmentedControl } from "../components/ui/Controls";
import { Skeleton, EmptyState } from "../components/ui/Feedback";
import { StatCard } from "../components/StatCard";
import { RequestsTable } from "../components/RequestsTable";
import { TokenUsageChart } from "../components/charts/TokenUsageChart";
import { SpendByModelChart } from "../components/charts/SpendByModelChart";
import { chartColor } from "../components/charts/palette";
import { useUsageData, type Range } from "../hooks/useUsageData";
import { percentChange, signedPercent, summarize } from "../lib/aggregates";
import { getUsageByModel } from "../data/usage";
import { useI18n } from "../i18n/i18n-context";
import { useFormat } from "../i18n/useFormat";

const RANGES: Range[] = [7, 30, 90];

export function Overview() {
  const { t, intlLocale } = useI18n();
  const fmt = useFormat();
  const [range, setRange] = useState<Range>(30);
  const { status, data, retry } = useUsageData(range);

  const summary = useMemo(() => {
    if (!data) return null;
    const current = summarize(data.trend.slice(-range));
    const previous = summarize(data.trend.slice(0, range));
    return {
      current,
      change: {
        tokens: percentChange(current.tokens, previous.tokens),
        cost: percentChange(current.cost, previous.cost),
        requests: percentChange(current.requests, previous.requests),
        latency: percentChange(current.latencyMs, previous.latencyMs),
        errorRate: percentChange(current.errorRate, previous.errorRate),
      },
    };
  }, [data, range]);

  const spend = useMemo(
    () => (data ? getUsageByModel(range).slice(0, 6) : []),
    [data, range],
  );

  const isLoading = status === "loading";

  if (status === "error") {
    return (
      <Card>
        <EmptyState
          icon={<TriangleAlert size={20} />}
          title={t("error.title")}
          description={t("error.description")}
          action={
            <button
              type="button"
              onClick={retry}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-500"
            >
              <RefreshCw size={14} />
              {t("common.retry")}
            </button>
          }
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t("overview.title")}
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {t("overview.subtitle", { range: t(`range.${range}`) })}
          </p>
        </div>
        <SegmentedControl
          ariaLabel={t("overview.title")}
          value={String(range)}
          onChange={(value) => setRange(Number(value) as Range)}
          options={RANGES.map((value) => ({
            value: String(value),
            label: `${t(`range.${value}`)} ${t("range.unit")}`,
          }))}
        />
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {isLoading || !summary ? (
          Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="p-5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-3 h-7 w-28" />
              <Skeleton className="mt-4 h-3 w-20" />
            </Card>
          ))
        ) : (
          <>
            <StatCard
              icon={Zap}
              label={t("stat.tokens")}
              value={fmt.compact(summary.current.tokens)}
              delta={signedPercent(summary.change.tokens, intlLocale)}
              deltaTone="positive"
              deltaLabel={t("stat.vsPrevious", { range: t(`range.${range}`) })}
              series={data?.daily.map((row) => row.inputTokens + row.outputTokens)}
            />
            <StatCard
              icon={Coins}
              label={t("stat.cost")}
              value={fmt.currency(summary.current.cost)}
              delta={signedPercent(summary.change.cost, intlLocale)}
              deltaTone="positive"
              deltaLabel={t("stat.vsPrevious", { range: t(`range.${range}`) })}
              series={data?.daily.map((row) => row.cost)}
            />
            <StatCard
              icon={ListChecks}
              label={t("stat.requests")}
              value={fmt.compact(summary.current.requests)}
              delta={signedPercent(summary.change.requests, intlLocale)}
              deltaTone="positive"
              deltaLabel={t("stat.vsPrevious", { range: t(`range.${range}`) })}
              series={data?.daily.map((row) => row.requests)}
            />
            <StatCard
              icon={Gauge}
              label={t("stat.latency")}
              value={fmt.ms(summary.current.latencyMs)}
              delta={signedPercent(summary.change.latency, intlLocale)}
              deltaTone="negative"
              deltaLabel={t("stat.vsPrevious", { range: t(`range.${range}`) })}
              series={data?.daily.map((row) => row.p50LatencyMs)}
            />
            <StatCard
              icon={TriangleAlert}
              label={t("stat.errorRate")}
              value={fmt.percent(summary.current.errorRate)}
              delta={signedPercent(summary.change.errorRate, intlLocale)}
              deltaTone="negative"
              deltaLabel={t("stat.vsPrevious", { range: t(`range.${range}`) })}
              series={data?.daily.map(
                (row) => (row.errors / Math.max(row.requests, 1)) * 100,
              )}
            />
          </>
        )}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <CardHeader
            title={t("chart.tokenUsage")}
            hint={t("chart.tokenUsageHint")}
            className="pb-4"
          />
          <div className="px-2 pb-4">
            {isLoading || !data ? (
              <Skeleton className="mx-3 h-[268px]" />
            ) : (
              <TokenUsageChart data={data.daily} />
            )}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader
            title={t("chart.costByModel")}
            hint={t("chart.costByModelHint")}
            className="pb-4"
          />
          <div className="px-2">
            {isLoading ? (
              <Skeleton className="mx-auto size-44 rounded-full" />
            ) : (
              <SpendByModelChart
                data={spend.map((row) => ({
                  name: row.model.name,
                  value: Number(row.cost.toFixed(2)),
                }))}
              />
            )}
          </div>
          <ul className="space-y-2 px-5 pb-5 pt-3">
            {spend.map((row, index) => (
              <li
                key={row.model.id}
                className="flex items-center gap-2.5 text-xs"
              >
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: chartColor(index) }}
                  aria-hidden
                />
                <span className="truncate text-zinc-600 dark:text-zinc-300">
                  {row.model.name}
                </span>
                <span className="ms-auto shrink-0 font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
                  {fmt.currency(row.cost)}
                </span>
                <span className="w-10 shrink-0 text-end tabular-nums text-zinc-500">
                  {fmt.percent(row.model.share, 0)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Card className="overflow-hidden">
        <CardHeader
          title={t("table.recent")}
          action={
            <Link
              to="/requests"
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-500/10"
            >
              {t("action.viewAll")}
              <ArrowRight size={14} className="rtl:rotate-180" aria-hidden />
            </Link>
          }
          className="pb-3"
        />
        {isLoading || !data ? (
          <div className="space-y-2 px-5 pb-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-11 w-full" />
            ))}
          </div>
        ) : (
          <RequestsTable rows={data.requests.slice(0, 6)} compact />
        )}
      </Card>
    </div>
  );
}
