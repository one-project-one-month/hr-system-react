// src/pages/EmployeeDashboard.tsx
import { useEffect, useMemo, useState } from "react";
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
import { useAuthStore } from "@/stores/useAuthStore";
import { useCheckInStore } from "@/stores/useCheckInStore";
import { EmployeeService } from "@/services/employeeService";
import { AttendanceHistogram } from "@/components/ui/custom/attendance-histogram";

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
    const [year, setYear] = useState("2025")
    const [chartData, setChartData] = useState([]);

    const bars = useMemo(
        () => [
            { dataKey: "netPay", name: "Net Pay", color: "#00A86B" },
            { dataKey: "deduction", name: "Deductions", color: "#B1E7D1" },
            { dataKey: "bonus", name: "Bonus", color: "#8A3FFC" },
        ],
        []
    );
    const mockAttendanceData = [
        { month: "Jan", present: 160, late: 18, year: 2025 },
        { month: "Feb", present: 152, late: 22, year: 2025 },
        { month: "Feb", present: 152, late: 22, year: 2025 },
        { month: "Feb", present: 152, late: 22, year: 2025 },
        { month: "Feb", present: 152, late: 22, year: 2025 },
        { month: "Mar", present: 168, late: 14, year: 2025 },
        { month: "Apr", present: 158, late: 20, year: 2025 },
        { month: "May", present: 170, late: 12, year: 2025 },
        { month: "Jun", present: 162, late: 16, year: 2025 },
        { month: "Jul", present: 155, late: 19, year: 2025 },
        { month: "Aug", present: 148, late: 25, year: 2025 },
        { month: "Sep", present: 165, late: 15, year: 2025 },
        { month: "Oct", present: 172, late: 11, year: 2025 },
        { month: "Nov", present: 160, late: 17, year: 2025 },
        { month: "Dec", present: 150, late: 23, year: 2025 },

        { month: "Jan", present: 162, late: 16, year: 2026 },
        { month: "Feb", present: 155, late: 20, year: 2026 },
        { month: "Mar", present: 170, late: 13, year: 2026 },
        { month: "Apr", present: 160, late: 18, year: 2026 },
        { month: "May", present: 175, late: 10, year: 2026 },
        { month: "Jun", present: 168, late: 14, year: 2026 },
        { month: "Jul", present: 158, late: 17, year: 2026 },
        { month: "Aug", present: 150, late: 21, year: 2026 },
        { month: "Sep", present: 167, late: 15, year: 2026 },
        { month: "Oct", present: 174, late: 9, year: 2026 },
        { month: "Nov", present: 162, late: 16, year: 2026 },
        { month: "Dec", present: 152, late: 22, year: 2026 },
    ];  useEffect(() => {
        (async () => {
            const data = await EmployeeService.fetchMonthlyPayrollComparison(year)
            setChartData(data.payrollChart)
        })()
    }, [year])

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
                    year={year}
                    yearOptions={['2025', '2026']}
                    footer="Monthly Pay Comparison"
                />
            </div>
            <div className="mt-4">
                <AttendanceHistogram 
                    data={mockAttendanceData} 
                    yearOptions={[2025,2026]} 
                />
            </div>
        </div>
    );
}

function CheckInOutCard() {
    const authUser = useAuthStore((s) => s.user);
    const data = useCheckInStore((s) => s.data);
    const loadCheckInData = useCheckInStore((s) => s.loadData);

    const [currentDateLabel] = useState(() => {
        const d = new Date();
        return d.toLocaleDateString(undefined, {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    });

    useEffect(() => {
        loadCheckInData(authUser?.employeeCode ?? "");
    }, []);

    const loading = useCheckInStore((s) => s.loading);
    const handleCheckInOut = useCheckInStore((s) => s.handleCheckInOut);

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
                        onClick={handleCheckInOut}
                        disabled={loading}
                        className={cn(
                            "flex h-[131px] w-[133px] flex-col items-center justify-center rounded-full",
                            "text-natural-50 font-bold text-xl leading-7 tracking-normal shadow-lg",
                            "bg-[linear-gradient(180deg,#55CB9D_0%,#83D9B7_50%,#3B9E77_100%)]",
                            loading ? "opacity-70 cursor-not-allowed" : ""
                        )}
                    >
                        {loading ? (
                            <span>Loading...</span>
                        ) : data?.isCheckIn ? (
                            <span>Check Out</span>
                        ) : (
                            <span>Check In</span>
                        )}
                    </Button>
                    <p className="text-text">
                        <span>{currentDateLabel}</span>
                    </p>
                </div>

                <div className="flex w-full items-center justify-center gap-6 text-text font-semibold">
                    <span>
                        Check In: <span>{!data?.checkInTime || data?.checkInTime === "" ? "--------" : data?.checkInTime}</span>
                    </span>
                    <span className="h-3 w-px bg-border" />
                    <span>
                        Check Out: <span>{!data?.checkOutTime || data?.checkOutTime === "" ? "--------" : data?.checkOutTime}</span>
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
                            <PieChart
                                margin={{
                                    top: 8,
                                    right: 35,
                                    bottom: 8,
                                    left: 1,
                                }}
                            >
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
                                        <Cell
                                            key={item.name}
                                            fill={item.color}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Legend area */}
                <div className="flex flex-1 flex-col gap-6">
                    <LeaveLegendItem
                        label="Annual"
                        colorClass="bg-primary-700"
                    />
                    <LeaveLegendItem
                        label="Sick Leave"
                        colorClass="bg-primary-200"
                    />
                    <LeaveLegendItem
                        label="Emergency Leave"
                        colorClass="bg-[#FB2C36]"
                    />
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
