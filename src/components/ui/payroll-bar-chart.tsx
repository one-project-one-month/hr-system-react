import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BarConfig = {
  dataKey: string;
  name: string;
  color: string;
};

export interface PayrollBarChartProps {
  data: Record<string, any>[];
  xKey: string;
  bars: BarConfig[];
  year: string;
  yearOptions?: string[];
  onYearChange?: (year: string) => void;
  footer?: string;
}

export function PayrollBarChart({
  data,
  xKey,
  bars,
  year,
  yearOptions = [year],
  onYearChange,
  footer,
}: PayrollBarChartProps) {
  return (
    <Card className="rounded-[16px] border border-natural-200 bg-background shadow-sm">
      {/* HEADER (year pill on the right) */}
      <CardHeader className="flex items-center justify-end pb-0 pt-4">
        <Select value={year} onValueChange={(value) => onYearChange?.(value)}>
          <SelectTrigger className="h-9 w-24 rounded-full border-none bg-primary-500 px-4 py-1 text-xs font-semibold text-white shadow-sm hover:bg-primary-600 focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="space-y-4 pt-4 pb-6">
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              barCategoryGap={40}
              barGap={6}
              margin={{ top: 24, right: 32, left: 32, bottom: 24 }}
            >
              {/* horizontal grid lines across the X area */}
              <CartesianGrid
                horizontal={true}
                vertical={false}
                strokeDasharray="3 3"
                stroke="#E5E7EB"
              />

              <XAxis
                dataKey={xKey}
                tickLine={false}
                axisLine={{
                  stroke: "hsl(var(--muted-foreground)/0.35)",
                  strokeWidth: 1,
                }}
                tick={{
                  fontSize: 11,
                  fill: "hsl(var(--muted-foreground))",
                }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                ticks={[0, 2000, 4000, 6000, 8000, 10000]}
                domain={[0, 10000]}
                tick={{
                  fontSize: 11,
                  fill: "hsl(var(--muted-foreground))",
                }}
                tickFormatter={(v: number) =>
                  v === 0 ? "0K" : `${Math.round(v / 1000)}K`
                }
              />

              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  border: "1px solid hsl(var(--border))",
                  fontSize: 12,
                }}
              />

              <Legend
                verticalAlign="top"
                align="end"
                iconType="circle"
                wrapperStyle={{
                  fontSize: 12,
                  paddingBottom: 12,
                }}
              />

              {bars.map((bar) => (
                <Bar
                  key={bar.dataKey}
                  dataKey={bar.dataKey}
                  name={bar.name}
                  stackId="pay"
                  barSize={18}
                  radius={[0, 0, 0, 0]}
                  fill={bar.color}
                  activeBar={{ fill: bar.color }} // no dark hover
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {footer && (
          <p className="pt-1 text-center text-[15px] font-semibold text-primary-600">
            {footer}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
