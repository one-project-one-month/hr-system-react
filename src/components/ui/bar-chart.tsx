// src/components/ui/bar-chart.tsx
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { dashboardService } from "@/services/dashboardService";
import type { AttendanceTypes } from "@/types/dashboardService";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Label,
} from "recharts";

type BarConfig = {
  dataKey: string;
  name?: string;
  /** CSS color value, e.g. "hsl(var(--primary))" */
  color?: string;
};

export type BarChartCardProps = {
  footer?: React.ReactNode;
  className?: string;
  xKey: string;
  bars: BarConfig[];
  /** current period value */
  /** called when the pill is clicked */
};

export function BarChartCard({
  className,
  xKey,
  bars,
  footer,
}: BarChartCardProps) {
  const [attendanceList, setAttendanceList] = useState<AttendanceTypes[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<number>(1);
  const onTogglePeriod = () => {
    setPeriod((prev) => (prev === 1 ? 2 : 1))
  }
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const resp = await dashboardService.fetchAttendanceLists(period);
        setAttendanceList(resp);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching dashboard stats.");
      }
    };

    fetchAttendance();
  }, [period]);

  return (
    <Card
      className={cn(
        "h-full rounded-[10px] bg-background shadow-sm border border-natural-200",
        className
      )}
    >
      {/* Header row just for the pill, like the screenshot */}
      <CardHeader className="flex items-start justify-end">
        <button
          type="button"
          onClick={onTogglePeriod}
          className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm"
        >
          {period === 1 ? "Weekly" : "Monthly"}
          {/* <span className="h-2 w-2 rounded-full bg-white" /> */}
        </button>
      </CardHeader>

      <CardContent className="pt-0 pb-6 space-y-3">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={attendanceList}
              barCategoryGap={60} // spacing similar to design
              margin={{ top: 10, right: 24, left: 0, bottom: 32 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />

              <XAxis
                dataKey={xKey}
                tickLine={false}
                axisLine={{ stroke: "#2F80ED" }}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => {
                  if (period === 1) {
                    // weekly → short date
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }
                  // monthly → already a month name
                  return value;
                }}
                label={{
                  value: period === 1 ? "Date" : "Month",
                  position: "centerBottom",
                  offset: 20,
                  fill: "#575A59",
                  fontSize: 16,
                  dy: 20,
                }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 11,
                  fill: "hsl(var(--muted-foreground))",
                }}
                label={
                  <Label
                    value="Percentage"
                    angle={-90}
                    position="insideLeft"
                    offset={10}
                    style={{
                      fontSize: 16,
                      fill: "#575A59",
                    }}
                  />
                }
              />

              <Tooltip
                // cursor={{ fill: "hsl(var(--muted) / 0.25)" }}
                cursor={false}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid hsl(var(--border))",
                  fontSize: 12,
                }}
              />

              <Legend
                verticalAlign="top"
                align="right"
                iconType="square"
                wrapperStyle={{
                  fontSize: 12,
                  paddingBottom: 12,
                }}
              />

              {bars.map((bar, idx) => (
                <Bar
                  key={bar.dataKey}
                  dataKey={bar.dataKey}
                  name={bar.name}
                  barSize={40}
                  radius={[0, 0, 0, 0]} // flat tops
                  activeBar={false}
                  fill={
                    bar.color ??
                    (idx === 0
                      ? "#00A86B" // dark green (check in)
                      : "#B1E7D1") // light green (check out)
                  }
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {footer && (
          <div className="pt-1 text-center text-xl font-semibold text-primary-600">
            {footer}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
