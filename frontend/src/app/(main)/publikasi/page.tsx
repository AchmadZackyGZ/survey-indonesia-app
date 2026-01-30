"use client";

import { useEffect, useState } from "react";
import { publicationService, Publication } from "@/services/publicationService";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calendar, User, Loader2 } from "lucide-react";
import Link from "next/link";

export default function PublikasiPage() {
  const [news, setNews] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await publicationService.getAll(page, 9); // Load 9 berita per halaman
        if (res.data && res.data.length > 0) {
          setNews(res.data);
          setHasMore(res.data.length === 9);
        } else {
          setNews([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Gagal ambil berita:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  return (
    <div className="min-h-screen bg-navy-950 pb-20 pt-10">
      <div className="container mx-auto px-4 md:px-6">
        {/* HEADER */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-serif font-bold text-white mb-4">
            Publikasi & Analisis
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Kumpulan artikel, opini, dan rilis pers terbaru dari tim peneliti
            kami.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-gold" />
          </div>
        )}

        {/* GRID BERITA */}
        {!loading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <Link
                key={item.id}
                href={`/publikasi/${item.slug}`}
                className="group h-full"
              >
                <article className="flex flex-col h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 transition-all duration-300 hover:border-gold/50 hover:shadow-2xl hover:shadow-gold/5 hover:-translate-y-2">
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        item.image_url ||
                        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80"
                      }
                      alt={item.title}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-xs font-bold text-slate-950 bg-gold rounded-full uppercase tracking-wider">
                        {item.type}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gold" />
                        {new Date(item.published_at).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-gold" />
                        {item.author}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-snug group-hover:text-gold transition-colors">
                      {item.title}
                    </h3>

                    {/* Excerpt (Strip HTML tags simple way) */}
                    <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-1">
                      {item.content.replace(/<[^>]*>?/gm, "")}
                    </p>

                    <span className="text-sm font-medium text-gold mt-auto group-hover:underline decoration-gold/50 underline-offset-4">
                      Baca Selengkapnya &rarr;
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {!loading && news.length > 0 && (
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
              Hal. {page}
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
