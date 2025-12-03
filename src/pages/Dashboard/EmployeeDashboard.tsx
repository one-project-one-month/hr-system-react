// src/pages/EmployeeDashboard.tsx
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { PayrollBarChart } from "@/components/ui/payroll-bar-chart";

/* --------------------------- mock data section --------------------------- */

const leaveTypeData = [
  { name: "Annual", value: 80, color: "#017E4D" },
  { name: "Sick Leave", value: 15, color: "#8BDBBB" },
  { name: "Emergency Leave", value: 5, color: "#FB2C36" },
];

const monthlyPayData = [
  { month: "Jan", netPay: 4000, deductions: 0, bonus: 0 },
  { month: "Feb", netPay: 4500, deductions: 0, bonus: 1000 },
  { month: "Mar", netPay: 3900, deductions: 0, bonus: 0 },
  { month: "Apr", netPay: 4100, deductions: 0, bonus: 0 },
  { month: "May", netPay: 4200, deductions: 0, bonus: 2000 },
  { month: "Jun", netPay: 4000, deductions: 0, bonus: 0 },
  { month: "Jul", netPay: 4050, deductions: 0, bonus: 0 },
  { month: "Aug", netPay: 4100, deductions: 0, bonus: 0 },
  { month: "Sep", netPay: 4150, deductions: 0, bonus: 0 },
  { month: "Oct", netPay: 4200, deductions: 0, bonus: 0 },
  { month: "Nov", netPay: 4300, deductions: 0, bonus: 0 },
  { month: "Dec", netPay: 4350, deductions: 0, bonus: 0 },
];

const weeklyPayData = [
  { week: "W1", netPay: 1000, deductions: 0, bonus: 0 },
  { week: "W2", netPay: 1100, deductions: 0, bonus: 200 },
  { week: "W3", netPay: 980, deductions: 0, bonus: 0 },
  { week: "W4", netPay: 1050, deductions: 0, bonus: 150 },
];

/* --------------------------- main dashboard ---------------------------- */

export default function EmployeeDashboard() {
  const [period, setPeriod] = useState<"weekly" | "monthly">("monthly");

  const chartData = period === "weekly" ? weeklyPayData : monthlyPayData;

  const bars = useMemo(
    () => [
      { dataKey: "netPay", name: "Net Pay", color: "#00A86B" },
      { dataKey: "deductions", name: "Deductions", color: "#B1E7D1" },
      { dataKey: "bonus", name: "Bonus", color: "#8A3FFC" },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-[#F5F7F8] px-4 pb-6 pt-12 md:px-8 md:pb-8 md:pt-12">
      <div className="grid gap-4.5 md:grid-cols-2">
        <CheckInOutCard />
        <LeaveTypeBreakdownCard />
      </div>

      {/* bottom row: bar chart */}
      <div className="mt-6">
        <PayrollBarChart
          data={chartData}
          xKey={period === "weekly" ? "week" : "month"}
          bars={bars}
          year="2024"
          footer="Monthly Pay Comparison"
        />
      </div>
    </div>
  );
}

function CheckInOutCard() {
  // plug real values from API later
  const currentDateLabel = "20/Oct/2025";
  const checkInTime = "------";
  const checkOutTime = "------";

  return (
    <Card className="rounded-[20px] border border-natural-200 bg-background shadow-sm gap-0 py-5 px-2.5">
      <CardHeader className="pb-2 px-0">
        <CardTitle className="text-2xl font-semibold text-slate-900">
          Check In/Out
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-4 pb-0 pt-0">
        <div className="flex flex-col items-center gap-2">
          <Button
            type="button"
            className={cn(
              "flex h-[131px] w-[133px] flex-col items-center justify-center rounded-full",
              "text-natural-50 font-bold text-xl leading-7 tracking-normal shadow-lg",
              "bg-[linear-gradient(180deg,#55CB9D_0%,#83D9B7_50%,#3B9E77_100%)]"
            )}
          >
            Check In
          </Button>
          <p className="text-text">
            <span>{currentDateLabel}</span>
          </p>
        </div>

        <div className="flex w-full items-center justify-center gap-6 text-text font-semibold">
          <span>
            Check In: <span>{checkInTime}</span>
          </span>
          <span className="h-3 w-px bg-border" />
          <span>
            Check Out: <span>{checkOutTime}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function LeaveTypeBreakdownCard() {
  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, percent } = props;
    if (!percent) return null;

    const radius = outerRadius + 14; // outside the ring
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#111827"
        fontSize={11}
        fontWeight={600}
        textAnchor={x >= cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  return (
    <Card className="h-full rounded-[20px] border border-natural-200 bg-background shadow-sm gap-0 py-5 px-2.5 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 px-0">
        <CardTitle className="text-2xl font-medium leading-8">
          Leave Type Breakdown
        </CardTitle>

        <Select defaultValue="2025">
          <SelectTrigger className="h-8 w-24 rounded-sm border-none bg-primary-500 px-4 py-1 text-xs font-semibold text-natural-50 shadow-sm hover:bg-primary-600 focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex items-center justify-between gap-6 pb-4 pt-1">
        {/* Donut chart area */}
        <div className="flex-1">
          {/* wider box so left label has room */}
          <div className="h-[180px] w-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 8, right: 35, bottom: 8, left: 1 }}>
                <Pie
                  data={leaveTypeData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={78}
                  startAngle={20}
                  endAngle={-360}
                  paddingAngle={0}
                  stroke="none"
                  cx="58%"
                  cy="50%"
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {leaveTypeData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend area */}
        <div className="flex flex-1 flex-col gap-6">
          <LeaveLegendItem label="Annual" colorClass="bg-primary-700" />
          <LeaveLegendItem label="Sick Leave" colorClass="bg-primary-200" />
          <LeaveLegendItem label="Emergency Leave" colorClass="bg-[#FB2C36]" />
        </div>
      </CardContent>
    </Card>
  );
}

type LeaveLegendItemProps = {
  label: string;
  colorClass: string;
};

function LeaveLegendItem({ label, colorClass }: LeaveLegendItemProps) {
  return (
    <div className="flex items-center gap-3">
      <span className={cn("h-7 w-7 border border-black/5", colorClass)} />
      <span className="text-text leading-6 ">{label}</span>
    </div>
  );
}
