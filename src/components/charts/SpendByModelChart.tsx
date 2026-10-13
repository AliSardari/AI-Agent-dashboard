import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useI18n } from "../../i18n/i18n-context";
import { useFormat } from "../../i18n/useFormat";
import { chartColor } from "./palette";
import { ChartTooltip } from "./ChartTooltip";

interface Slice {
  name: string;
  value: number;
}

interface Props {
  data: Slice[];
  height?: number;
}

export function SpendByModelChart({ data, height = 240 }: Props) {
  const fmt = useFormat();
  const { t } = useI18n();
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <div className="relative" dir="ltr" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="64%"
            outerRadius="92%"
            paddingAngle={2}
            stroke="none"
            isAnimationActive={false}
          >
            {data.map((slice, index) => (
              <Cell
                key={slice.name}
                fill={chartColor(index)}
              />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip format={(value) => fmt.currency(value)} />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[11px] uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
          {t("stat.cost")}
        </span>
        <span className="text-xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
          {fmt.currency(total)}
        </span>
      </div>
    </div>
  );
}
