"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { publicationService, Publication } from "@/services/publicationService";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce"; // 1. Import Hook Debounce
import {
  Calendar,
  User,
  ArrowRight,
  Loader2,
  FileText,
  Search,
} from "lucide-react";

export default function PublicPublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // 2. Pasang Debounce (Jeda 500ms agar hemat resource server)
  const debouncedSearch = useDebounce(searchQuery, 500);

  // 3. Effect: Jalan setiap kali hasil ketikan berhenti (debouncedSearch berubah)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Tampilkan loading spinner saat mencari
      try {
        // Panggil API dengan parameter SEARCH
        // page=1, limit=9 (agar grid rapi), search=...
        const res = await publicationService.getAll(1, 9, debouncedSearch);
        setPublications(res.data || []);
      } catch (error) {
        console.error("Gagal memuat publikasi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [debouncedSearch]); // Dependency array ke debouncedSearch

  // HAPUS Client-side filter (filteredData) karena data sudah disaring Backend

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col gap-3 items-center justify-center text-gold">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-slate-400 text-sm animate-pulse">
          Memuat Data Publikasi...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-slate-800 pb-8">
          <div className="max-w-2xl">
            <span className="text-gold font-bold tracking-widest text-xs uppercase mb-2 block">
              Wawasan & Analisis
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">
              Publikasi Terbaru
            </h1>
            <p className="text-slate-400 mt-4 text-lg">
              Temukan artikel, opini pakar, dan rilis pers mendalam mengenai
              dinamika sosial-politik Indonesia.
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="w-full md:w-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-500 group-focus-within:text-gold transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Cari topik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-full py-3 pl-10 pr-4 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
            />
          </div>
        </div>

        {/* --- GRID ARTIKEL --- */}
        {/* GUNAKAN 'publications' LANGSUNG (Bukan filteredData) */}
        {publications.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publications.map((item) => (
              <div
                key={item.id}
                className="group bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-800 hover:border-gold/50 transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-gold/5"
              >
                {/* 1. THUMBNAIL AREA */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                  {/* Badge Kategori */}
                  <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur border border-slate-700 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-20">
                    {item.category || "UMUM"}
                  </span>

                  <Link href={`/publikasi/${item.slug}`}>
                    {item.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-90 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 bg-slate-800/50">
                        <FileText className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-xs">No Image</span>
                      </div>
                    )}
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                  </Link>
                </div>

                {/* 2. KONTEN AREA */}
                <div className="p-6 flex flex-col flex-1 border-t border-slate-800/50">
                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
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
                      <span className="truncate max-w-[100px]">
                        {item.author || "Admin LSI"}
                      </span>
                    </div>
                  </div>

                  {/* Judul */}
                  <Link href={`/publikasi/${item.slug}`} className="block mb-3">
                    <h3 className="text-xl font-bold text-white leading-snug group-hover:text-gold transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>

                  {/* Excerpt / Cuplikan */}
                  <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {item.content.replace(/<[^>]*>?/gm, "").substring(0, 140)}
                    ...
                  </p>

                  {/* Tombol Baca */}
                  <Link href={`/publikasi/${item.slug}`} className="mt-auto">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-gold hover:text-white transition-colors group/btn font-medium text-sm"
                    >
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-24 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Tidak ditemukan
            </h3>
            <p className="text-slate-400 max-w-md">
              Maaf, kami tidak menemukan artikel dengan kata kunci
              {searchQuery}. Coba kata kunci lain.
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
