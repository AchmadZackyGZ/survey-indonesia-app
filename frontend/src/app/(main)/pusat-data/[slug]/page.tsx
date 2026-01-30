"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Hook untuk ambil slug dari URL
import { surveyService, Survey } from "@/services/surveyService";
import SurveyBarChart from "@/components/charts/SurveyBarChart";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Share2, Tag } from "lucide-react";
import Link from "next/link";

export default function SurveyDetailPage() {
  const { slug } = useParams(); // Ambil slug dari URL browser
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        // Panggil API getBySlug yang sudah kita buat sebelumnya
        const res = await surveyService.getBySlug(slug as string);
        if (res.data) {
          setSurvey(res.data);
        }
      } catch (error) {
        console.error("Gagal ambil detail survei:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950">
        <div className="animate-pulse text-gold font-serif text-xl">
          Memuat Data Riset...
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-navy-950 text-white gap-4">
        <h1 className="text-2xl font-bold">Data Tidak Ditemukan</h1>
        <Link href="/pusat-data">
          <Button variant="outline">Kembali ke Pusat Data</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 pb-20 pt-8">
      {/* 1. BREADCRUMB & BACK BUTTON */}
      <div className="container mx-auto px-4 md:px-6 mb-8">
        <Link href="/pusat-data">
          <Button
            variant="ghost"
            className="text-slate-400 hover:text-gold pl-0 gap-2 bg-transparent hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Arsip
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* KOLOM KIRI: KONTEN TEKS (Detail Analisa) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Judul */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-bold border border-gold/20 uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {survey.category}
                </span>
                <span className="text-slate-400 text-sm flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(survey.published_at).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight mb-6">
                {survey.title}
              </h1>
            </div>

            {/* AREA GRAFIK UTAMA (Mobile & Desktop) */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <h3 className="text-lg font-bold text-white mb-6 border-l-4 border-gold pl-3">
                Visualisasi Data
              </h3>
              {/* Kita gunakan chart yang sama, tapi kali ini ukurannya menyesuaikan container */}
              <div className="h-[400px] w-full">
                <SurveyBarChart
                  labels={survey.chart_data.labels}
                  series={survey.chart_data.series}
                />
              </div>
              <div className="mt-4 text-center text-xs text-slate-500 italic">
                Sumber: Survei Nasional LSI (Margin of Error ±2.5%)
              </div>
            </div>

            {/* Deskripsi / Analisa */}
            <article className="prose prose-invert prose-lg max-w-none text-slate-300">
              <h3 className="text-xl font-bold text-white mb-2">
                Analisis Temuan
              </h3>
              <p className="leading-relaxed whitespace-pre-line">
                {survey.description}
              </p>
              {/* Jika nanti ada field 'content' html panjang, bisa ditaruh disini */}
            </article>
          </div>

          {/* KOLOM KANAN: SIDEBAR (Info Tambahan) */}
          <div className="space-y-6">
            <div className="sticky top-24">
              {/* Kotak Share / Download */}
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-4">
                <h4 className="font-bold text-white mb-2">Bagikan Riset Ini</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="w-full border-slate-700 text-slate-700 hover:bg-slate-800 hover:text-white"
                  >
                    <Share2 className="w-4 h-4 mr-2" /> Share
                  </Button>
                  <Button className="w-full bg-gold text-slate-950 hover:bg-gold-light font-bold">
                    Download PDF
                  </Button>
                </div>
              </div>

              {/* Kotak Metodologi Singkat */}
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 mt-6">
                <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-widest border-b border-slate-800 pb-2">
                  Metodologi
                </h4>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex justify-between">
                    <span>Metode:</span>
                    <span className="text-white font-medium">
                      Multistage Random Sampling
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Responden:</span>
                    <span className="text-white font-medium">1,200 Orang</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Wilayah:</span>
                    <span className="text-white font-medium">34 Provinsi</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
