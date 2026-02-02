"use client";

import { useEffect, useState } from "react";
import { surveyService, Survey } from "@/services/surveyService";
import SurveyBarChart from "@/components/charts/SurveyBarChart";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";

export default function LatestSurveys() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await surveyService.getLatest();
        if (res.data) {
          setSurveys(res.data);
        }
      } catch (error) {
        console.error("Gagal ambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (surveys.length === 0) return null;

  const featuredSurvey = surveys[0];
  const otherSurveys = surveys.slice(1);

  return (
    <section className="py-24 bg-slate-950 border-t border-slate-900 relative overflow-hidden">
      {/* Background Glow Effect (Dekorasi) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* HEADER SECTION */}
        <div className="mb-12 flex flex-col md:flex-row items-end justify-between gap-4">
          <div>
            <span className="text-gold font-bold tracking-wider uppercase text-xs mb-2 block">
              Data Center
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
              Temuan Riset Terbaru
            </h2>
            <p className="mt-3 text-slate-400 max-w-lg text-lg">
              Analisis mendalam mengenai dinamika sosial, ekonomi, dan politik
              terkini.
            </p>
          </div>
          <Link href="/pusat-data" className="hidden md:block">
            <Button
              variant="outline"
              className="h-12 px-6 border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-gold hover:text-slate-950 hover:border-gold transition-all duration-300"
            >
              Lihat Semua Data <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* CARD UTAMA (FEATURED) */}
          <div className="lg:col-span-2 rounded-3xl bg-slate-900 border border-slate-800 p-1 shadow-2xl overflow-hidden group">
            <div className="bg-slate-900/50 p-6 md:p-8 rounded-[20px] h-full flex flex-col">
              {/* Header Card */}
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400 border border-blue-500/20 uppercase tracking-wide">
                  {featuredSurvey.category}
                </span>
                <span className="flex items-center text-xs font-medium text-gold/80 bg-gold/5 px-2 py-1 rounded-md border border-gold/10">
                  <TrendingUp className="w-3 h-3 mr-1.5" />
                  Trending Topic
                </span>
              </div>

              <Link
                href={`/pusat-data/${featuredSurvey.slug}`}
                className="group-hover:text-blue-400 transition-colors"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
                  {featuredSurvey.title}
                </h3>
              </Link>

              <p className="text-slate-400 mb-8 leading-relaxed line-clamp-2">
                {featuredSurvey.description}
              </p>

              {/* --- BAGIAN GRAFIK (HEIGHT DIPERBESAR DISINI) --- */}
              {/* Mobile: 300px, Desktop: 400px. Margin top otomatis (mt-auto) biar rapi di bawah */}
              <div className="mt-auto w-full h-[300px] md:h-[400px] bg-slate-950 rounded-xl border border-slate-800 p-4 relative">
                {/* Label kecil di pojok grafik */}
                <div className="absolute top-4 right-4 z-10 text-[10px] text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                  Visualisasi Data
                </div>
                <SurveyBarChart
                  labels={featuredSurvey.chart_data.labels}
                  series={featuredSurvey.chart_data.series}
                />
              </div>
            </div>
          </div>

          {/* SIDEBAR LIST (OTHER SURVEYS) */}
          <div className="space-y-4 flex flex-col">
            {otherSurveys.map((item) => (
              <Link
                key={item.id}
                href={`/pusat-data/${item.slug}`}
                className="block group"
              >
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 transition-all duration-300 hover:bg-slate-800 hover:border-slate-700 hover:translate-x-1">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.published_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 uppercase group-hover:text-gold group-hover:border-gold/30 transition-colors">
                      {item.category}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-200 group-hover:text-white transition-colors line-clamp-2 leading-snug mb-2">
                    {item.title}
                  </h4>

                  <div className="flex items-center text-xs text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                    Baca Selengkapnya <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </Link>
            ))}

            {/* Banner/CTA Kecil di bawah list */}
            <div className="mt-auto pt-4">
              <div className="rounded-2xl bg-gradient-to-br from-gold to-yellow-600 p-6 text-slate-950 relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="font-bold text-lg mb-1">
                    Butuh Data Spesifik?
                  </h4>
                  <p className="text-sm font-medium opacity-80 mb-4">
                    Kami menyediakan layanan riset custom.
                  </p>
                  <Link href="/kontak">
                    <Button
                      size="sm"
                      className="bg-slate-950 text-white hover:bg-slate-800 w-full border-none"
                    >
                      Hubungi Tim Riset
                    </Button>
                  </Link>
                </div>
                {/* Pattern Background */}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              </div>
            </div>

            {/* Tombol Mobile Only */}
            <div className="md:hidden pt-4">
              <Link href="/pusat-data">
                <Button className="w-full bg-slate-800 text-white hover:bg-gold hover:text-slate-950 h-12">
                  Lihat Semua Data
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
