import { useId } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "./ui/Card";
import { cn } from "../lib/cn";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  /** e.g. "+12%" */
  delta?: string;
  /**
   * Whether the delta is good or bad for the business — an error rate going up
   * is red even though the number rose.
   */
  deltaTone?: "positive" | "negative";
  deltaLabel?: string;
  /** Values for the sparkline, oldest first. */
  series?: number[];
  hint?: string;
}

function buildPath(values: number[], width = 100, height = 32): string {
  if (values.length < 2) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = width / (values.length - 1);

  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / span) * (height - 4) - 2;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  deltaTone = "positive",
  deltaLabel,
  series,
  hint,
}: StatCardProps) {
  const gradientId = useId();
  const line = series ? buildPath(series) : "";
  const rising = delta?.trim().startsWith("+");

  return (
    <Card className="relative overflow-hidden p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {label}
          </p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50">
            {value}
          </p>
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
          <Icon size={18} aria-hidden />
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          {delta ? (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-medium tabular-nums",
                deltaTone === "positive"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400",
              )}
            >
              {rising ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {delta}
            </span>
          ) : null}
          {deltaLabel ? (
            <p className="mt-0.5 truncate text-[11px] text-zinc-500 dark:text-zinc-400">
              {deltaLabel}
            </p>
          ) : null}
          {hint ? (
            <p className="mt-0.5 truncate text-[11px] text-zinc-400 dark:text-zinc-500">
              {hint}
            </p>
          ) : null}
        </div>

        {line ? (
          <svg
            viewBox="0 0 100 32"
            preserveAspectRatio="none"
            aria-hidden
            className="h-8 w-24 shrink-0"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`${line} L100,32 L0,32 Z`}
              fill={`url(#${gradientId})`}
            />
            <path
              d={line}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ) : null}
      </div>
    </Card>
  );
}
