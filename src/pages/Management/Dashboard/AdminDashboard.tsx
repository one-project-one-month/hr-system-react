// src/pages/AdminDashboard.tsx  (or wherever your route/page lives)
import { useEffect, useState } from "react";
import { Users, UserX, FolderKanban } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartCard } from "@/components/ui/bar-chart";
import {
  dashboardService,
  type AttendanceTypes,
  type DashboardStats,
} from "@/services/dashboardService";

const attendanceWeekly = [
  { date: "Oct 2", checkIn: 35, checkOut: 10 },
  { date: "Oct 3", checkIn: 45, checkOut: 14 },
  { date: "Oct 4", checkIn: 43, checkOut: 11 },
  { date: "Oct 5", checkIn: 47, checkOut: 9 },
  { date: "Oct 6", checkIn: 42, checkOut: 9 },
];

const attendanceMonthly = [
  { date: "Week 1", checkIn: 160, checkOut: 40 },
  { date: "Week 2", checkIn: 170, checkOut: 38 },
  { date: "Week 3", checkIn: 155, checkOut: 42 },
  { date: "Week 4", checkIn: 165, checkOut: 39 },
];

export default function AdminDashboard() {
  const [range, setRange] = useState<"weekly" | "monthly">("weekly");

  const chartData = range === "weekly" ? attendanceWeekly : attendanceMonthly;

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [attendanceList, setAttendanceList] = useState<AttendanceTypes | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log(attendanceList);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // setLoading(true);
        // setError(null);

        const resp = await dashboardService.fetchStatsCards();

        if (!resp.isSuccess || !resp.data) {
          setError(resp.message || "Failed to load dashboard stats");
          return;
        }

        setStats(resp.data);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    const fetchAttendance = async () => {
      try {
        const resp = await dashboardService.fetchAttendanceLists();
        setAttendanceList(resp.data);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching dashboard stats.");
      }
    };

    fetchStats();
    fetchAttendance();
  }, []);

  return (
    <div className="w-full space-y-6 h-auto p-6">
      {/* Metrics row */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total Employee"
          value={stats?.totalEmployee}
          icon={Users}
        />
        <StatCard
          label="Today Absence"
          value={stats?.todayAbsence}
          icon={UserX}
        />
        <StatCard
          label="Total Project"
          value={stats?.totalProject}
          icon={FolderKanban}
        />
      </div>

      {/* Chart section */}
      <div className="space-y-3">
        <BarChartCard
          data={chartData}
          xKey="date"
          period={range}
          onTogglePeriod={() =>
            setRange((prev) => (prev === "weekly" ? "monthly" : "weekly"))
          }
          bars={[
            {
              dataKey: "checkIn",
              name: "Check in",
              color: "#00A86B",
            },
            {
              dataKey: "checkOut",
              name: "Check out",
              color: "#B1E7D1",
            },
          ]}
          footer={<>Attendance&nbsp; check in / check out histogram</>}
        />
      </div>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: number | undefined;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <Card className="bg-background shadow-sm rounded-lg shadow-[#0000001A] border-transparent">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold text-primary-700">
          {label}
        </CardTitle>
        <Icon className="h-6 w-6 text-emerald-500" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-primary-700">{value}</div>
      </CardContent>
    </Card>
  );
}
