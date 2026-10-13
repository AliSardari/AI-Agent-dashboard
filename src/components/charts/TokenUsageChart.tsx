import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useI18n } from "../../i18n/i18n-context";
import { useFormat } from "../../i18n/useFormat";
import { useTheme } from "../../theme/theme-context";
import type { DailyUsage } from "../../data/usage";
import { ChartTooltip } from "./ChartTooltip";

const INPUT_COLOR = "#8b5cf6";
const OUTPUT_COLOR = "#06b6d4";

interface Props {
  data: DailyUsage[];
  height?: number;
}

export function TokenUsageChart({ data, height = 268 }: Props) {
  const { t } = useI18n();
  const fmt = useFormat();
  const { theme } = useTheme();
  const gridColor = theme === "dark" ? "#27272a" : "#e4e4e7";
  const axisColor = theme === "dark" ? "#71717a" : "#a1a1aa";

  return (
    <div style={{ height }} dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="fillInput" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={INPUT_COLOR} stopOpacity={0.45} />
              <stop offset="100%" stopColor={INPUT_COLOR} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="fillOutput" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={OUTPUT_COLOR} stopOpacity={0.45} />
              <stop offset="100%" stopColor={OUTPUT_COLOR} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fill: axisColor, fontSize: 11 }}
            tickMargin={8}
            minTickGap={28}
            tickFormatter={(value: number) => fmt.shortDate(value)}
          />
          <YAxis
            orientation="right"
            tickLine={false}
            axisLine={false}
            width={54}
            tick={{ fill: axisColor, fontSize: 11 }}
            tickMargin={4}
            tickFormatter={(value: number) => fmt.compact(value)}
          />
          <Tooltip
            cursor={{ stroke: axisColor, strokeDasharray: "3 3" }}
            content={<ChartTooltip format={(value) => fmt.compact(value)} />}
          />
          <Area
            type="monotone"
            dataKey="inputTokens"
            name={t("chart.input")}
            stackId="1"
            stroke={INPUT_COLOR}
            strokeWidth={2}
            fill="url(#fillInput)"
          />
          <Area
            type="monotone"
            dataKey="outputTokens"
            name={t("chart.output")}
            stackId="1"
            stroke={OUTPUT_COLOR}
            strokeWidth={2}
            fill="url(#fillOutput)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
