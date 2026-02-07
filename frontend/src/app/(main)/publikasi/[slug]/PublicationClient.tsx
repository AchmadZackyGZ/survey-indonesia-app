"use client";

import { Button } from "@/components/ui/button";
import { Publication } from "@/services/publicationService";
import { ArrowLeft, Calendar, User, Share2, AlertTriangle } from "lucide-react";
import Link from "next/link";

// Menerima data langsung sebagai Props (Tidak perlu useState/useEffect lagi)
export default function PublicationClient({
  article,
}: {
  article: Publication | null;
}) {
  // 1. Not Found State (Jika data null dari server)
  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col gap-4 items-center justify-center text-white">
        <AlertTriangle className="w-12 h-12 text-yellow-500" />
        <div className="text-center">
          <h2 className="text-xl font-bold">Artikel tidak ditemukan</h2>
          <p className="text-slate-400 mb-4">
            Artikel yang Anda cari mungkin telah dihapus atau URL salah.
          </p>
          <Link href="/publikasi">
            <Button className="bg-gold hover:bg-gold-light text-slate-950">
              Kembali ke Publikasi
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 2. Render UI (Langsung tampil tanpa Loading!)
  return (
    <div className="min-h-screen bg-slate-950 pb-20 pt-24">
      {/* Back Button */}
      <div className="container mx-auto px-4 md:px-6 mb-8 max-w-4xl">
        <Link href="/publikasi">
          <Button
            variant="ghost"
            className="text-slate-400 hover:text-gold pl-0 gap-2 bg-transparent hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Publikasi
          </Button>
        </Link>
      </div>

      <article className="container mx-auto px-4 md:px-6 max-w-4xl">
        {/* HEADER ARTIKEL */}
        <header className="mb-10 text-center">
          <span className="inline-block px-4 py-1 mb-6 text-sm font-bold text-slate-950 bg-gold rounded-full uppercase tracking-wider">
            {article.category || "Umum"}
          </span>

          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight mb-6">
            {article.title}
          </h1>

          <div className="flex items-center justify-center gap-6 text-slate-400 text-sm border-y border-slate-800 py-4 max-w-xl mx-auto">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold" />
              {new Date(article.created_at).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gold" />
              {article.author || "Admin LSI"}
            </div>
          </div>
        </header>

        {/* THUMBNAIL */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl mb-12 border border-slate-800 shadow-2xl bg-slate-900">
          {article.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.thumbnail}
              alt={article.title}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-700">
              <span className="italic">Tidak ada gambar</span>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed space-y-6">
          <div className="whitespace-pre-line">{article.content}</div>
        </div>

        {/* FOOTER */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex justify-between items-center">
          <div className="text-slate-500 text-sm">&copy; LSI Research Team</div>
          <Button
            variant="outline"
            className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Share2 className="w-4 h-4 mr-2" /> Bagikan
          </Button>
        </div>
      </article>
    </div>
  );
}
