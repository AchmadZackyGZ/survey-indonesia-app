"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { surveyService, Survey } from "@/services/surveyService";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce"; // Hook yang baru kita buat
import {
  BarChart3,
  Calendar,
  ArrowRight,
  Loader2,
  Search,
  FileText,
} from "lucide-react";

export default function PusatDataPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Gunakan Debounce (Tunggu 500ms setelah berhenti mengetik)
  const debouncedSearch = useDebounce(searchQuery, 1000);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Tampilkan loading saat mencari
      try {
        // Kirim kata kunci pencarian ke Backend
        // page=1, limit=100, search=debouncedSearch
        const res = await surveyService.getAll(1, 100, debouncedSearch);
        setSurveys(res.data || []);
      } catch (error) {
        console.error("Gagal memuat data survei:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [debouncedSearch]);

  // filteredData sudah tidak diperlukan karena filtering dilakukan di backend
  // filtering data ini adalah client-side filtering yang lama so jadiii tidak perlu pake lagi
  // const filteredData = surveys.filter((item) =>
  //   item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  // );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col gap-3 items-center justify-center text-gold">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-slate-400 text-sm animate-pulse">
          Memuat Pusat Data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* --- HEADER (Sama seperti Publikasi) --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-slate-800 pb-8">
          <div className="max-w-2xl">
            <span className="text-gold font-bold tracking-widest text-xs uppercase mb-2 block">
              Arsip Penelitian
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">
              Pusat Data Survei
            </h1>
            <p className="text-slate-400 mt-4 text-lg">
              Akses transparan ke hasil riset, data polling, dan statistik
              elektabilitas terbaru.
            </p>
          </div>

          <div className="w-full md:w-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-500 group-focus-within:text-gold transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Cari data survei..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-72 bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-full py-3 pl-10 pr-4 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
            />
          </div>
        </div>

        {/* --- GRID SURVEI (Style Persis Publikasi) --- */}
        {surveys.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {surveys.map((item) => (
              <div
                key={item.id}
                className="group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-gold/50 transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-gold/10"
              >
                {/* 1. GAMBAR UTAMA (THUMBNAIL) */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-800">
                  {/* Badge Kategori */}
                  <span className="absolute top-4 left-4 bg-gold text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10">
                    {item.category || "RISET"}
                  </span>

                  <Link href={`/pusat-data/${item.slug}`}>
                    {item.thumbnail ? (
                      // JIKA ADA GAMBAR (Jokowi), TAMPILKAN INI
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      // JIKA TIDAK ADA, TAMPILKAN PLACEHOLDER ELEGANT
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-800/50 group-hover:bg-slate-800 transition-colors">
                        <BarChart3 className="w-16 h-16 mb-2 opacity-50 group-hover:text-gold group-hover:opacity-100 transition-all duration-500" />
                        <span className="text-xs font-medium tracking-wide">
                          DATA LSI
                        </span>
                      </div>
                    )}
                    {/* Overlay Gradient Halus */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                  </Link>
                </div>

                {/* 2. KONTEN AREA */}
                <div className="p-6 flex flex-col flex-1 border-t border-slate-800/50">
                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gold" />
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    {item.respondents && (
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-gold" />
                        <span>{item.respondents} Responden</span>
                      </div>
                    )}
                  </div>

                  {/* Judul */}
                  <Link
                    href={`/pusat-data/${item.slug}`}
                    className="block mb-3"
                  >
                    <h3 className="text-xl font-bold text-white leading-snug group-hover:text-gold transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>

                  {/* Deskripsi */}
                  <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {item.description ||
                      "Simak detail hasil survei dan analisis statistik lengkap dalam laporan ini."}
                  </p>

                  {/* Tombol Baca */}
                  <Link href={`/pusat-data/${item.slug}`} className="mt-auto">
                    <Button
                      variant="link"
                      className="p-0 text-gold hover:text-white transition-colors group/btn font-medium text-sm"
                    >
                      Lihat Data Lengkap{" "}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900 rounded-3xl border border-slate-800">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Data tidak ditemukan
            </h3>
            <p className="text-slate-400">
              Tidak ada hasil survei yang cocok dengan kata kunci {searchQuery}.
            </p>
            <Button
              onClick={() => setSearchQuery("")}
              variant="ghost"
              className="mt-4 text-gold hover:text-gold transition-colors"
            >
              Reset Pencarian
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
