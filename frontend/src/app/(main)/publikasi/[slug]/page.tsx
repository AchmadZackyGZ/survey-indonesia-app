"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { publicationService, Publication } from "@/services/publicationService";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import Link from "next/link";

export default function PublicationDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      try {
        const res = await publicationService.getBySlug(slug as string);
        if (res.data) setArticle(res.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold">
        Memuat Artikel...
      </div>
    );
  if (!article)
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center text-white">
        Artikel tidak ditemukan
      </div>
    );

  return (
    <div className="min-h-screen bg-navy-950 pb-20 pt-8">
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
            {article.type}
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight mb-6">
            {article.title}
          </h1>

          <div className="flex items-center justify-center gap-6 text-slate-400 text-sm border-y border-slate-800 py-4 max-w-xl mx-auto">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold" />
              {new Date(article.published_at).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gold" />
              {article.author}
            </div>
          </div>
        </header>

        {/* FEATURED IMAGE */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl mb-12 border border-slate-800 shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              article.image_url ||
              "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80"
            }
            alt={article.title}
            className="object-cover w-full h-full"
          />
        </div>

        {/* ISI KONTEN (Render HTML) */}
        <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed space-y-6">
          {/* Karena kita menyimpan HTML dari Admin, kita render sebagai HTML */}
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* FOOTER ARTIKEL */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex justify-between items-center">
          <div className="text-slate-500 text-sm">&copy; LSI Research Team</div>
          <Button
            variant="outline"
            className="border-slate-700 text-slate-700 hover:bg-slate-300"
          >
            <Share2 className="w-4 h-4 mr-2" /> Bagikan
          </Button>
        </div>
      </article>
    </div>
  );
}
