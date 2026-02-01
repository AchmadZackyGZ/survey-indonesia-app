"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  // Cell saya hapus karena tidak perlu import lagi
} from "recharts";

interface SurveyBarChartProps {
  labels: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    payload: {
      label: string;
      value: number;
      unit: string;
    };
  }[];
  label?: string;
}

// Komponen Tooltip (Pop-up saat hover)
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl z-50">
        <p className="text-slate-400 text-xs mb-1 font-medium">{label}</p>
        <div className="flex items-end gap-1">
          <span className="text-gold font-bold text-lg leading-none">
            {Number(dataPoint.value).toLocaleString("id-ID")}
          </span>
          <span className="text-xs text-slate-500 mb-0.5">
            {dataPoint.unit}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function SurveyBarChart({
  labels,
  series,
}: SurveyBarChartProps) {
  // Safety Check: Pastikan series ada isinya
  const currentSeries =
    series && series.length > 0 ? series[0] : { name: "", data: [] };
  const dataNumbers = currentSeries.data || [];

  // Transform Data untuk Recharts
  const chartData = labels.map((label, index) => ({
    label: label,
    value: dataNumbers[index] || 0,
    unit: currentSeries.name,
  }));

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#334155"
            opacity={0.3}
          />

          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            dy={10}
            interval={0}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "#ffffff", opacity: 0.05 }}
          />

          {/* PERBAIKAN: Hapus <Cell> dan loop. Langsung pasang fill di <Bar> */}
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
            fill="#EAB308" // Warna Kuning Emas
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
