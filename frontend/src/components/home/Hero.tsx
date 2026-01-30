"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3 } from "lucide-react";
import { surveyService, Survey } from "@/services/surveyService";

export default function Hero() {
  const [latestSurvey, setLatestSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);

  // Ambil data survei paling baru (Top 1)
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await surveyService.getLatest();
        if (res.data && res.data.length > 0) {
          setLatestSurvey(res.data[0]);
        }
      } catch (error) {
        console.error("Gagal load hero data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // --- LOGIKA TAMPILAN ---

  // 1. Badge Text (Disini kita taruh Judul Surveinya)
  // Jika ada data: "Terbaru: [Judul Survey]"
  // Jika loading/kosong: "Lembaga Survei Indonesia"
  const badgeText = latestSurvey
    ? `Rilis Terbaru: ${latestSurvey.title}`
    : "Lembaga Survei Indonesia";

  // 2. Link Tombol (Arah tombol ke detail survei tersebut)
  const heroLink = latestSurvey
    ? `/pusat-data/${latestSurvey.slug}`
    : "/pusat-data";

  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 md:py-32 flex items-center min-h-[80vh]">
      {/* Background decoration (Glow effect) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-900/20 blur-[100px] rounded-full opacity-50 pointer-events-none" />

      <div className="container relative mx-auto px-4 md:px-6 text-center z-10">
        {/* BADGE AREA: Menampilkan JUDUL SURVEY TERBARU disini */}
        <Link href={heroLink}>
          <div className="inline-flex items-center rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold backdrop-blur-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 hover:bg-gold/20 transition-colors cursor-pointer max-w-[90vw] truncate">
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse shrink-0"></span>
            <span className="truncate">
              {loading ? "Memuat data terkini..." : badgeText}
            </span>
            <ArrowRight className="ml-2 h-3 w-3 opacity-50" />
          </div>
        </Link>

        {/* HEADLINE UTAMA (TETAP / STATIS) */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white mb-6 leading-tight max-w-5xl mx-auto drop-shadow-2xl">
          Data Akurat, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold">
            Keputusan Tepat.
          </span>
        </h1>

        {/* SUBHEADLINE (Tetap deskripsi umum branding, bukan deskripsi survey) */}
        <p className="mx-auto max-w-[800px] text-lg text-slate-400 md:text-xl mb-10 leading-relaxed">
          Menyajikan riset politik, sosial, dan ekonomi dengan metodologi
          standar emas untuk kemajuan demokrasi Indonesia.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={heroLink}>
            <Button
              size="lg"
              className="h-14 px-8 bg-gold hover:bg-gold-light text-slate-950 font-bold text-base rounded-full shadow-lg shadow-gold/20 transition-all hover:scale-105"
            >
              Lihat Detail Data
              <BarChart3 className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <Link href="/tentang-kami">
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-full bg-transparent/50 backdrop-blur-sm transition-all"
            >
              Pelajari Metodologi
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
