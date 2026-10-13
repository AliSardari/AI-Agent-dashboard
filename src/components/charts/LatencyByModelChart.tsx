import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useI18n } from "../../i18n/i18n-context";
import { useFormat } from "../../i18n/useFormat";
import { useTheme } from "../../theme/theme-context";
import { ChartTooltip } from "./ChartTooltip";

interface Row {
  name: string;
  value: number;
}

interface Props {
  data: Row[];
  height?: number;
}

export function LatencyByModelChart({ data, height = 240 }: Props) {
  const fmt = useFormat();
  const { t } = useI18n();
  const { theme } = useTheme();
  const gridColor = theme === "dark" ? "#27272a" : "#e4e4e7";
  const axisColor = theme === "dark" ? "#71717a" : "#a1a1aa";

  return (
    <div dir="ltr" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, bottom: 0, left: 0 }}
          barCategoryGap={8}
        >
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tick={{ fill: axisColor, fontSize: 11 }}
            tickFormatter={(value: number) => fmt.compact(value)}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={112}
            tickLine={false}
            axisLine={false}
            tick={{ fill: axisColor, fontSize: 11 }}
          />
          <Tooltip
            cursor={{ fill: theme === "dark" ? "#27272a22" : "#e4e4e766" }}
            content={<ChartTooltip format={(value) => fmt.ms(value)} />}
          />
          <Bar
            dataKey="value"
            name={t("chart.axis.ms")}
            fill="#8b5cf6"
            radius={[0, 6, 6, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
