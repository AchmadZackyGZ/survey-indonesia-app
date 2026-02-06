"use client";

import { useEffect, useState } from "react";
import { dashboardService } from "@/services/dashboardService";
import {
  BarChart3,
  FileText,
  Mail,
  TrendingUp,
  Loader2,
  Calendar,
} from "lucide-react";
// 1. IMPORT RECHARTS
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

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total_surveys: 0,
    total_publications: 0,
    total_contacts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardService.getStats();
        // --- LOGIKA PENYELAMAT (DEFENSIVE CODE) ---
        // Kita ambil data dari res.data.
        // Tanda '?' (optional chaining) mencegah error jika data null.
        // Tanda '|| 0' memaksa jadi nol jika datanya undefined/null.
        const safeData = {
          total_surveys: res.data?.total_surveys || 0,
          total_publications: res.data?.total_publications || 0,
          total_contacts: res.data?.total_contacts || 0,
        };

        setStats(safeData);
      } catch (error) {
        console.error("Gagal memuat statistik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // 2. DATA UNTUK GRAFIK (Diambil dari State Real)
  const chartData = [
    {
      name: "Survei",
      total: stats.total_surveys,
      color: "#C5A059", // Gold
    },
    {
      name: "Artikel",
      total: stats.total_publications,
      color: "#1e293b", // Slate-900
    },
    {
      name: "Pesan",
      total: stats.total_contacts,
      color: "#2563eb", // Blue-600
    },
  ];

  // Hitung Total Data (Aman dari NaN karena variabel diatas sudah pasti angka)
  const totalData =
    stats.total_surveys + stats.total_publications + stats.total_contacts;

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 text-sm">
            Ringkasan aktivitas platform LSI hari ini.
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 shadow-sm flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gold" />
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      {/* STATS CARDS (GRID) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Survei */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                Total Survei
              </p>
              <h3 className="text-4xl font-bold text-slate-900">
                {stats.total_surveys}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center text-xs font-medium text-green-600 bg-green-50 w-fit px-2 py-1 rounded">
            <TrendingUp className="w-3 h-3 mr-1" />
            Update Real-time
          </div>
        </div>

        {/* Card 2: Publikasi */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                Artikel & Berita
              </p>
              <h3 className="text-4xl font-bold text-slate-900">
                {stats.total_publications}
              </h3>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center text-xs font-medium text-green-600 bg-green-50 w-fit px-2 py-1 rounded">
            <TrendingUp className="w-3 h-3 mr-1" />
            Update Real-time
          </div>
        </div>

        {/* Card 3: Pesan */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                Pesan Masuk
              </p>
              <h3 className="text-4xl font-bold text-slate-900">
                {stats.total_contacts}
              </h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center text-xs font-medium text-green-600 bg-green-50 w-fit px-2 py-1 rounded">
            <TrendingUp className="w-3 h-3 mr-1" />
            Update Real-time
          </div>
        </div>
      </div>

      {/* --- BAGIAN BARU: CHART SECTION --- */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Grafik Batang (Besar) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Statistik Data Sistem
            </h3>
            <p className="text-sm text-slate-500">
              Perbandingan jumlah konten yang telah diinput ke database.
            </p>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#f1f5f9" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kolom Kanan: Quick Actions / Info Tambahan */}
        <div className="bg-navy-950 p-6 rounded-xl border border-slate-800 text-white flex flex-col justify-center text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border-2 border-gold animate-pulse">
              <TrendingUp className="w-8 h-8 text-gold" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Performa Website</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Data survei dan publikasi Anda terus bertambah. Pertahankan
            konsistensi update konten untuk meningkatkan traffic.
          </p>
          <div className="py-3 px-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">
              Total Data
            </span>
            <p className="text-2xl font-bold text-white mt-1">{totalData}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
