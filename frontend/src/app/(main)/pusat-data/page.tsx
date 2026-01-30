"use client";

import { useEffect, useState } from "react";
import { surveyService, Survey } from "@/services/surveyService";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, BarChart3, Loader2 } from "lucide-react";
import Link from "next/link";

export default function PusatDataPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Cek apakah masih ada data selanjutnya

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Request 6 data per halaman
        const res = await surveyService.getAll(page, 6);

        if (res.data && res.data.length > 0) {
          setSurveys(res.data);
          // Jika data yang dikembalikan kurang dari limit (6), berarti ini halaman terakhir
          setHasMore(res.data.length === 6);
        } else {
          setSurveys([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Gagal ambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Efek ini jalan setiap kali nomor 'page' berubah
  }, [page]);

  return (
    <div className="min-h-screen bg-navy-950 pb-20 pt-10">
      <div className="container mx-auto px-4 md:px-6">
        {/* HEADER */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-serif font-bold text-white mb-4">
            Pusat Data Survei
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Akses arsip lengkap hasil penelitian kami. Data disajikan secara
            transparan untuk kebutuhan akademik dan publik.
          </p>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-gold" />
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && surveys.length === 0 && (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
            <p className="text-slate-500">Belum ada data survei tersedia.</p>
          </div>
        )}

        {/* SURVEY GRID */}
        {!loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {surveys.map((item) => (
              <Link
                key={item.id}
                href={`/pusat-data/${item.slug}`}
                className="group h-full"
              >
                <div className="h-full flex flex-col rounded-xl bg-slate-900 border border-slate-800 overflow-hidden transition-all duration-300 hover:border-gold/50 hover:shadow-xl hover:shadow-gold/5 hover:-translate-y-1">
                  {/* Bagian Atas: Kategori & Tanggal */}
                  <div className="p-6 pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 rounded-full bg-blue-500/10 text-xs font-bold text-blue-400 border border-blue-500/20">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {new Date(item.published_at).toLocaleDateString(
                          "id-ID",
                          { year: "numeric", month: "short", day: "numeric" },
                        )}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors line-clamp-2 leading-tight">
                      {item.title}
                    </h3>
                  </div>

                  {/* Bagian Tengah: Grafik Preview Kecil (Visual Sugar) */}
                  <div className="px-6 py-2 flex-1">
                    <p className="text-sm text-slate-400 line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Footer Card */}
                  <div className="p-6 pt-4 mt-auto border-t border-slate-800 bg-slate-950/30 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Lihat Grafik Detail
                    </span>
                    <ArrowRight className="w-4 h-4 text-gold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {!loading && surveys.length > 0 && (
          <div className="mt-16 flex justify-center items-center gap-4">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="border-slate-700 bg-transparent text-white hover:bg-slate-800 disabled:opacity-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Sebelumnya
            </Button>

            <span className="text-slate-400 font-mono text-sm">
              Halaman {page}
            </span>

            <Button
              variant="outline"
              disabled={!hasMore}
              onClick={() => setPage((p) => p + 1)}
              className="border-slate-700 bg-transparent text-white hover:bg-slate-800 disabled:opacity-50"
            >
              Selanjutnya <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
