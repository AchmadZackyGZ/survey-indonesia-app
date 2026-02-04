"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { publicationService, Publication } from "@/services/publicationService";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, FileText } from "lucide-react";

export default function LatestPublications() {
  const [latestData, setLatestData] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await publicationService.getLatest();
        setLatestData(res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  if (loading || latestData.length === 0) return null;

  return (
    <section className="py-24 bg-slate-950 border-t border-slate-900">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-gold font-bold tracking-widest text-xs uppercase mb-2 block">
              Update Terkini
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4 leading-tight">
              Analisis & Publikasi Pilihan
            </h2>
            <p className="text-slate-400 text-lg">
              Perspektif mendalam dari para pakar kami mengenai isu-isu
              strategis nasional.
            </p>
          </div>
          <Link href="/publikasi">
            <Button
              variant="outline"
              className="h-12 px-6 border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-gold hover:text-slate-950 hover:border-gold transition-all duration-300"
            >
              Lihat Semua Publikasi
            </Button>
          </Link>
        </div>

        {/* Grid Artikel Terbaru */}
        <div className="grid md:grid-cols-3 gap-8">
          {latestData.map((item) => (
            <div
              key={item.id}
              className="group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-gold/50 transition-all duration-300 flex flex-col"
            >
              {/* Image Area */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-800">
                <span className="absolute top-4 left-4 bg-slate-950/90 border border-slate-700 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider z-10">
                  {item.category || "TERBARU"}
                </span>

                <Link href={`/publikasi/${item.slug}`}>
                  {item.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-800/50">
                      <FileText className="w-10 h-10" />
                    </div>
                  )}
                </Link>
              </div>

              {/* Content Area */}
              <div className="p-6 flex flex-col flex-1 border-t border-slate-800">
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gold" />
                    {new Date(item.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-700" />
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gold" />
                    <span className="truncate max-w-[80px]">
                      {item.author || "Admin"}
                    </span>
                  </div>
                </div>

                <Link href={`/publikasi/${item.slug}`}>
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-gold transition-colors leading-snug">
                    {item.title}
                  </h3>
                </Link>

                <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-1">
                  {item.content.replace(/<[^>]*>?/gm, "").substring(0, 100)}...
                </p>

                <Link
                  href={`/publikasi/${item.slug}`}
                  className="mt-auto inline-flex items-center text-sm text-gold font-medium hover:underline group/link"
                >
                  Baca Selengkapnya{" "}
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
