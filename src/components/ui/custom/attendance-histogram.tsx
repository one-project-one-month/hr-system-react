"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { EmployeeService } from "@/services/employeeService";
import { useAuthStore } from "@/stores/useAuthStore";
import { shortMonth } from "@/lib/mapper";

type AttendanceApiData = {
  month: string;
  present: number;
  late: number;
};

type Props = {
  yearOptions: number[];
};

export function AttendanceHistogram({ yearOptions }: Props) {
  const [attendanceData, setAttendanceData] = useState<AttendanceApiData[]>()
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState( yearOptions.includes(currentYear) ? currentYear : yearOptions[0])
  const { user } = useAuthStore()
  useEffect(() => {
    (async () => {
      try {
        const fetchedAttendance: AttendanceApiData[] = await EmployeeService.fetchEmployeeAttendance(year, user?.employeeCode ?? "")
        const mappedData: AttendanceApiData[] = fetchedAttendance?.map(
          data => ({
            ...data,
            month: shortMonth(data.month)
          }))
        setAttendanceData(mappedData)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [year])
  return (
    <Card className="w-full bg-natural-50 !border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Attendance Histogram — {year}</CardTitle>

        <Select value={year.toString()} onValueChange={(v) => setYear(Number(v))}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="bg-natural-50">
            {yearOptions.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceData}>
              <XAxis
                dataKey="month"
                label={{
                  value: "Month",
                  position: "insideBottom",
                  offset: -10, // 👈 move label down (increase for more space)
                }}
              />

              <YAxis allowDecimals={false}
                label={{
                  value: "Hours",
                  angle: -90,
                  position: "insideLeft",
                }} />
              <Tooltip />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
              />

              <ReferenceLine
                y={160}
                stroke="#FF6B6B"
                strokeDasharray="4 4"
                label={{
                  value: "Target: 160 hrs",
                  position: "right",
                  fill: "#FF6B6B",
                  fontSize: 12,
                }}
              />

              <Bar
                dataKey="present"
                name="Present Hours"
                fill="#02A162"
                barSize={14}
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="late"
                name="Late Hours"
                fill="#B1E7D1"
                barSize={14}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}