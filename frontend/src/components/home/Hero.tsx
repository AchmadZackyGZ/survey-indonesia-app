import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 md:py-32">
      {/* Background decoration (Glow effect) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-900/20 blur-[100px] rounded-full opacity-50 pointer-events-none" />

      <div className="container relative mx-auto px-4 md:px-6 text-center">
        {/* Badge Kecil diatas Headline */}
        <div className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1 text-sm font-medium text-gold-light backdrop-blur-sm mb-6">
          <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
          Data Terbaru: Elektabilitas Q4 2025
        </div>

        {/* HEADLINE */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white mb-6">
          Data Akurat, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold">
            Keputusan Tepat.
          </span>
        </h1>

        {/* SUBHEADLINE */}
        <p className="mx-auto max-w-[700px] text-lg text-slate-400 md:text-xl mb-10 leading-relaxed">
          Menyajikan riset politik, sosial, dan ekonomi dengan metodologi
          standar emas Gold Standard untuk kemajuan demokrasi Indonesia.
        </p>

        {/* CALL TO ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/pusat-data">
            <Button
              size="lg"
              className="h-12 px-8 bg-gold hover:bg-gold-light text-slate-950 font-bold text-base rounded-full"
            >
              Lihat Hasil Riset
              <BarChart3 className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Link href="/tentang-kami">
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 border-slate-700 text-slate-300 hover:bg-slate-900 hover:text-white rounded-full bg-transparent"
            >
              Pelajari Metodologi
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
