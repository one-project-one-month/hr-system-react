"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
import { useMemo, useState } from "react";

type AttendanceApiData = {
  month: string;
  present: number;
  late: number;
};

type Props = {
  data: AttendanceApiData[];
  yearOptions: number[];
};

export function AttendanceHistogram({ data, yearOptions }: Props) {
  const [year, setYear] = useState(yearOptions[0]);

  return (
    <Card className="w-full bg-natural-50 !border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Attendance Histogram — {year}</CardTitle>

        <Select value={year.toString()} onValueChange={(v) => setYear(Number(v))}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
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
            <BarChart data={data}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />

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