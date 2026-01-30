"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios"; // Pastikan path axios benar
import { authService } from "@/services/authService";
import { BarChart3, FileText, Mail, Loader2, ArrowUpRight, LucideIcon } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total_surveys: 0,
    total_publications: 0,
    total_messages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Panggil API yang baru kita buat
        // Kita pakai api helper agar Token otomatis terkirim di header
        const res = await api.get("/dashboard/stats");
        if (res.data && res.data.data) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error("Gagal ambil stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Komponen Kartu Kecil (Widget)
  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs text-slate-400">
        <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
        <span>Update Real-time</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* 1. WELCOME SECTION */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard Overview
          </h1>
          <p className="text-slate-500">
            Ringkasan aktivitas platform LSI hari ini.
          </p>
        </div>
        <div className="hidden md:block">
          <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 shadow-sm">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* 2. STATS GRID */}
      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="animate-spin text-gold h-8 w-8" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <StatCard
            title="Total Survei"
            value={stats.total_surveys}
            icon={BarChart3}
            color="bg-blue-600"
          />
          <StatCard
            title="Artikel & Berita"
            value={stats.total_publications}
            icon={FileText}
            color="bg-orange-500"
          />
          <StatCard
            title="Pesan Masuk"
            value={stats.total_messages}
            icon={Mail}
            color="bg-emerald-500"
          />
        </div>
      )}

      {/* 3. AREA KOSONG UNTUK FITUR SELANJUTNYA */}
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
        <p className="text-slate-400 text-sm">
          Grafik Analitik Pengunjung akan ditambahkan disini (Next Phase)
        </p>
      </div>
    </div>
  );
}
