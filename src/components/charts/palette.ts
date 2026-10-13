/** Ordered palette shared by the charts; index follows the data order. */
export const CHART_COLORS = [
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
  "#10b981",
  "#f43f5e",
  "#6366f1",
  "#14b8a6",
  "#a855f7",
  "#84cc16",
] as const;

/** Safe palette lookup — wraps around when there are more slices than colors. */
export function chartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length] ?? CHART_COLORS[0];
}
