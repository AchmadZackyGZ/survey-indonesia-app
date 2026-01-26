"use client";

import { useEffect, useState } from "react";
import { publicationService, Publication } from "@/services/publicationService";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LatestPublications() {
  const [news, setNews] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await publicationService.getLatest();
        if (res.data) {
          setNews(res.data);
        }
      } catch (error) {
        console.error("Gagal ambil berita:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return null; // Tidak perlu loading spinner disini biar clean, tunggu muncul saja
  if (news.length === 0) return null;

  return (
    <section className="py-24 bg-navy-950 border-t border-slate-900 relative">
      <div className="container mx-auto px-4 md:px-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
              Analisis & Publikasi
            </h2>
            <p className="text-slate-400 max-w-xl text-lg">
              Perspektif mendalam dari para pakar kami mengenai dinamika sosial
              politik terkini.
            </p>
          </div>
          <Link href="/publikasi">
            <Button
              variant="ghost"
              className="text-gold hover:text-white hover:bg-slate-800 -ml-4 md:ml-0"
            >
              Baca Selengkapnya <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* NEWS GRID */}
        <div className="grid gap-8 md:grid-cols-3">
          {news.map((item, index) => (
            <Link
              key={item.id}
              href={`/publikasi/${item.slug}`}
              className="group"
            >
              <article className="flex flex-col h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 transition-all duration-300 hover:border-gold/50 hover:shadow-2xl hover:shadow-gold/5 hover:-translate-y-2">
                {/* Image Placeholder / Real Image */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-800">
                  {/* Menggunakan img tag biasa agar tidak ribet config hostname Next.js dulu */}

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      item.image_url ||
                      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop"
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
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gold" />
                      {new Date(item.published_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 text-gold" />
                      {item.author}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-snug group-hover:text-gold transition-colors">
                    {item.title}
                  </h3>

                  {/* Kita render HTML content sedikit saja sebagai excerpt, lalu strip tag HTML-nya */}
                  <div className="text-slate-400 text-sm line-clamp-3 mb-6 flex-1">
                    {item.content.replace(/<[^>]*>?/gm, "")}
                  </div>

                  <div className="flex items-center text-sm font-medium text-gold mt-auto group-hover:underline decoration-gold/50 underline-offset-4">
                    Baca Artikel
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
