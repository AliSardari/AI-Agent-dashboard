import type { DailyUsage } from "../data/usage";

export interface PeriodSummary {
  tokens: number;
  cost: number;
  requests: number;
  /** Mean of the daily p50 latencies. */
  latencyMs: number;
  errorRate: number;
}

export function summarize(rows: DailyUsage[]): PeriodSummary {
  const tokens = rows.reduce(
    (sum, row) => sum + row.inputTokens + row.outputTokens,
    0,
  );
  const cost = rows.reduce((sum, row) => sum + row.cost, 0);
  const requests = rows.reduce((sum, row) => sum + row.requests, 0);
  const errors = rows.reduce((sum, row) => sum + row.errors, 0);
  const latencyMs = rows.length
    ? rows.reduce((sum, row) => sum + row.p50LatencyMs, 0) / rows.length
    : 0;

  return {
    tokens,
    cost,
    requests,
    latencyMs,
    errorRate: requests > 0 ? errors / requests : 0,
  };
}

/** Relative change between two periods: (current - previous) / previous. */
export function percentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return (current - previous) / previous;
}

/** Formats a ratio as a signed "+12.3%" string. */
export function signedPercent(ratio: number, locale: string, digits = 1): string {
  const value = new Intl.NumberFormat(locale, {
    style: "percent",
    signDisplay: "exceptZero",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(ratio);
  return value;
}
