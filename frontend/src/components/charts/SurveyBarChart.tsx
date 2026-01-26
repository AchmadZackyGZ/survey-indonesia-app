"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface SurveyBarChartProps {
  labels: string[];
  series: number[];
}

export default function SurveyBarChart({
  labels,
  series,
}: SurveyBarChartProps) {
  // 1. Transformasi Data: Backend punya array terpisah, Recharts butuh array of objects
  const data = labels.map((label, index) => ({
    name: label,
    value: series[index],
  }));

  // Warna gradasi untuk batang grafik (Gold Theme)
  const colors = ["#f59e0b", "#fbbf24", "#d97706", "#b45309"];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 20, right: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
            stroke="#334155"
          />

          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            width={100}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "#334155",
              color: "#fff",
            }}
            itemStyle={{ color: "#fbbf24" }}
          />

          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
