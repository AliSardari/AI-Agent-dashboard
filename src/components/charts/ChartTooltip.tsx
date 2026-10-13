import { useFormat } from "../../i18n/useFormat";

interface TipPayload {
  name?: string | number;
  value?: number | string | Array<number | string>;
  color?: string;
  dataKey?: string | number;
}

export interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: TipPayload[];
  /** Formats every value; receives the raw number. */
  format?: (value: number) => string;
}

/** Localized tooltip shared by every chart in the app. */
export function ChartTooltip({ active, payload, label, format }: ChartTooltipProps) {
  const fmt = useFormat();
  if (!active || !payload?.length) return null;

  const header =
    typeof label === "number" ? fmt.shortDate(label) : String(label ?? "");

  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
      <p className="mb-1.5 font-medium text-zinc-500 dark:text-zinc-400">
        {header}
      </p>
      <ul className="space-y-1">
        {payload.map((entry, index) => {
          const raw = typeof entry.value === "number" ? entry.value : Number(entry.value);
          const text = format
            ? format(raw)
            : fmt.compact(Number.isFinite(raw) ? raw : 0);
          return (
            <li
              key={`${entry.name ?? index}`}
              className="flex items-center gap-2 tabular-nums"
            >
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
                aria-hidden
              />
              <span className="text-zinc-600 dark:text-zinc-300">
                {entry.name}
              </span>
              <span className="ms-auto font-medium text-zinc-900 dark:text-zinc-100">
                {text}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
