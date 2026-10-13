import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Search, SearchX, TriangleAlert } from "lucide-react";
import { Card } from "../components/ui/Card";
import { SegmentedControl, IconButton } from "../components/ui/Controls";
import { Skeleton, EmptyState } from "../components/ui/Feedback";
import { RequestsTable } from "../components/RequestsTable";
import { useUsageData } from "../hooks/useUsageData";
import { getModels, type RequestStatus } from "../data/usage";
import { useI18n } from "../i18n/i18n-context";
import { useFormat } from "../i18n/useFormat";
import type { TranslationKey } from "../i18n/translations";

type Filter = "all" | RequestStatus;

const STATUS_FILTERS: { value: Filter; labelKey: TranslationKey }[] = [
  { value: "all", labelKey: "requests.filterAll" },
  { value: "success", labelKey: "status.success" },
  { value: "error", labelKey: "status.error" },
  { value: "limited", labelKey: "status.limited" },
];

const PAGE_SIZE = 12;

export function Requests() {
  const { t, dir } = useI18n();
  const fmt = useFormat();
  const { status, data, retry } = useUsageData(30);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [query, filter]);

  const models = useMemo(() => getModels(), []);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return data.requests.filter((row) => {
      if (filter !== "all" && row.status !== filter) return false;
      if (!q) return true;
      const model = models.find((entry) => entry.id === row.modelId);
      return (
        row.id.toLowerCase().includes(q) ||
        (model?.name.toLowerCase().includes(q) ?? false) ||
        (model?.provider.toLowerCase().includes(q) ?? false)
      );
    });
  }, [data, query, filter, models]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

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
            {t("requests.title")}
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {t("requests.subtitle")}
          </p>
        </div>
        <SegmentedControl
          ariaLabel={t("table.status")}
          value={filter}
          onChange={setFilter}
          options={STATUS_FILTERS.map((entry) => ({
            value: entry.value,
            label: t(entry.labelKey),
          }))}
        />
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
          <Search size={16} className="shrink-0 text-zinc-400" aria-hidden />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("requests.search")}
            aria-label={t("requests.search")}
            className="h-8 w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
          />
        </div>

        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-11 w-full" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<SearchX size={20} />}
            title={t("requests.empty")}
            description={t("requests.emptyHint")}
          />
        ) : (
          <RequestsTable rows={rows} />
        )}

        {!isLoading && filtered.length > 0 ? (
          <div className="flex items-center justify-between gap-3 border-t border-zinc-100 px-4 py-3 dark:border-zinc-800">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t("table.showing", {
                from: fmt.number(start + 1),
                to: fmt.number(Math.min(start + PAGE_SIZE, filtered.length)),
                total: fmt.number(filtered.length),
              })}
            </p>
            <div className="flex items-center gap-1">
              <IconButton
                label={t("table.previous")}
                variant="outline"
                disabled={currentPage <= 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                className="disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft
                  size={16}
                  className={dir === "rtl" ? "rotate-180" : undefined}
                />
              </IconButton>
              <span className="px-2 text-xs tabular-nums text-zinc-500">
                {fmt.number(currentPage)} / {fmt.number(totalPages)}
              </span>
              <IconButton
                label={t("table.next")}
                variant="outline"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((value) => value + 1)}
                className="disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight
                  size={16}
                  className={dir === "rtl" ? "rotate-180" : undefined}
                />
              </IconButton>
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
