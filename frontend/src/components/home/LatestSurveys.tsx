"use client";

import { useEffect, useState } from "react";
import { surveyService, Survey } from "@/services/surveyService";
import SurveyBarChart from "@/components/charts/SurveyBarChart";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, TrendingUp } from "lucide-react";
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
    // UBAH 1: Background Section jadi bg-slate-950 (Navy Gelap)
    <section className="py-20 bg-slate-950 border-t border-slate-900">
      <div className="container mx-auto px-4 md:px-6">
        {/* HEADER SECTION */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-serif font-bold text-white">
              Hasil Riset Terbaru
            </h2>
            <p className="mt-2 text-slate-400">
              Temuan data terkini langsung dari lapangan.
            </p>
          </div>
          <Link href="/pusat-data" className="hidden md:block">
            <Button
              variant="outline"
              className="border-slate-700 bg-transparent text-slate-300 hover:bg-gold hover:text-slate-950 transition-all"
            >
              Lihat Semua Data <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* UBAH 2: Card Utama jadi Gelap (bg-slate-900) */}
          <div className="lg:col-span-2 rounded-2xl bg-slate-900 p-8 border border-slate-800 shadow-2xl relative overflow-hidden group">
            {/* Efek Glow dekorasi di belakang */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>

            <div className="relative z-10 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20">
                  {featuredSurvey.category}
                </span>
                <span className="flex items-center text-xs text-slate-500">
                  <TrendingUp className="w-3 h-3 mr-1 text-gold" />
                  Trending Survey
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                {featuredSurvey.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                {featuredSurvey.description}
              </p>
            </div>

            {/* AREA GRAFIK */}
            <div className="rounded-xl bg-slate-950/50 p-6 border border-slate-800/50 backdrop-blur-sm">
              <SurveyBarChart
                labels={featuredSurvey.chart_data.labels}
                series={featuredSurvey.chart_data.series}
              />
            </div>
          </div>

          {/* UBAH 3: List Samping jadi Gelap & Interactive */}
          <div className="space-y-4">
            {otherSurveys.map((item) => (
              <Link
                key={item.id}
                href={`/pusat-data/${item.slug}`}
                className="block"
              >
                <div className="group relative rounded-xl bg-slate-900 p-6 transition-all hover:-translate-y-1 hover:bg-slate-800 hover:shadow-lg hover:shadow-gold/5 border border-slate-800 hover:border-slate-700">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-gold">
                      {new Date(item.published_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-200 group-hover:text-gold transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}

            {/* Tombol Mobile Only (muncul kalau layar kecil) */}
            <div className="md:hidden pt-4">
              <Link href="/pusat-data">
                <Button className="w-full bg-slate-800 text-white hover:bg-gold hover:text-slate-950">
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
