import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { projectService } from "@/services/projectService";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const DEFAULT_COLORS = [
  "#60A5FA", // blue-400
  "#34D399", // emerald-400
  "#F59E0B", // amber-500
  "#F472B6", // pink-400
  "#A78BFA", // violet-400
];

type projectOverview = {
  percentage: number;
  projectStatus: string;
  statusCount: number;
}


export default function PieChartWithPercentage({
  data = [
    { name: "Ongoing Project", value: 125 },
    { name: "Pending", value: 50 },
  ],
  colors = DEFAULT_COLORS,
}) {
  const [projectOverview, setProjectOverview] = useState()

  const fetchProjectOverview = async () => {
    const response = await projectService.fetchProjectOverview()
    const formattedData = response.map((item) => ({
      name: item.projectStatus,
      value: item.percentage, // or item.statusCount
    }));

    setProjectOverview(formattedData)
  }

  useEffect(() => {
    fetchProjectOverview()
  }, [])
  return (
    <Card className="w-full h-full bg-natural-50 border-none py-0 gap-2">
      <div className="flex justify-between pt-3 px-2 w-full">
        <CardTitle className="text-xl">Project Overview</CardTitle>
      </div>

      <CardContent className="flex justify-center items-center w-full p-2">
        <div className="flex justify-center items-center w-full h-[160px]">
          <ResponsiveContainer width="90%" height="100%">
            <PieChart>
              <Pie
                data={projectOverview}
                dataKey="value"
                nameKey="name"
                cx="40%"
                cy="50%"
                outerRadius={70}
                labelLine={false}
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  percent,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius =
                    innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="white"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={11}
                    >
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>

              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="rect"
                iconSize={14}
                wrapperStyle={{
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  lineHeight: "1.5rem",
                }}
                formatter={(value) => <span className="text-sm">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
