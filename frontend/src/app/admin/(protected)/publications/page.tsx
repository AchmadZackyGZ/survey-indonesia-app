"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { publicationService, Publication } from "@/services/publicationService";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  FileText,
  Calendar,
  AlertCircle,
  Eye, // <--- Import icon Mata
} from "lucide-react";

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Fetch Data
  const loadData = async () => {
    try {
      const res = await publicationService.getAll();
      setPublications(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 2. Handle Delete
  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus artikel ini?")) {
      await publicationService.delete(id);
      loadData();
    }
  };

  // 3. Filter Search
  const filteredData = publications.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Publikasi & Berita
          </h1>
          <p className="text-slate-500 text-sm">
            Kelola artikel, berita, dan rilis pers.
          </p>
        </div>
        <Link href="/admin/publications/create">
          <Button className="w-full md:w-auto bg-gold hover:bg-gold-light text-slate-950 font-bold shadow-lg shadow-gold/20">
            <Plus className="w-4 h-4 mr-2" /> Tulis Artikel Baru
          </Button>
        </Link>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul artikel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-sm text-slate-900"
          />
        </div>
      </div>

      {/* --- EMPTY STATE --- */}
      {filteredData.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">
            Belum ada artikel publikasi.
          </p>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAMPILAN 1: TABLE VIEW (DESKTOP ONLY)                     */}
      {/* ========================================================= */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-xs font-semibold">
            <tr>
              <th className="p-4 w-16 text-center">No</th>
              <th className="p-4">Artikel</th>
              <th className="p-4 w-40">Kategori</th>
              <th className="p-4 w-40">Tanggal</th>
              <th className="p-4 w-32 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.map((item, index) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50 transition-colors group"
              >
                <td className="p-4 text-center text-slate-400">{index + 1}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {item.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.thumbnail}
                        alt=""
                        className="w-10 h-10 rounded object-cover bg-slate-100"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                        <FileText className="w-5 h-5" />
                      </div>
                    )}
                    <span className="font-bold text-slate-800 line-clamp-1">
                      {item.title}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                    {item.category || "Umum"}
                  </span>
                </td>
                <td className="p-4 text-slate-500 text-xs">
                  {new Date(item.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* 1. VIEW BUTTON */}
                    <Link href={`/publikasi/${item.slug}`} target="_blank">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-slate-200 text-slate-500"
                        title="Lihat"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>

                    {/* 2. EDIT BUTTON */}
                    <Link href={`/admin/publications/edit/${item.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-blue-50 text-blue-600"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>

                    {/* 3. DELETE BUTTON */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="h-8 w-8 hover:bg-red-50 text-red-600"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========================================================= */}
      {/* TAMPILAN 2: CARD VIEW (MOBILE ONLY)                       */}
      {/* ========================================================= */}
      <div className="md:hidden grid gap-4">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4"
          >
            {/* Header Card */}
            <div className="flex gap-3">
              {/* Thumbnail Kecil */}
              <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-slate-100 overflow-hidden">
                {item.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.thumbnail}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <FileText />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded mb-1 inline-block">
                  {item.category || "Umum"}
                </span>
                <h3 className="font-bold text-slate-900 leading-tight line-clamp-2 mb-1">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.created_at).toLocaleDateString("id-ID")}
                </div>
              </div>
            </div>

            {/* Action Buttons (3 Kolom: Lihat | Edit | Hapus) */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
              {/* VIEW */}
              <Link
                href={`/publikasi/${item.slug}`}
                target="_blank"
                className="w-full"
              >
                <Button
                  variant="outline"
                  className="w-full border-slate-200 text-slate-600 h-9 text-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                </Button>
              </Link>

              {/* EDIT */}
              <Link
                href={`/admin/publications/edit/${item.id}`}
                className="w-full"
              >
                <Button
                  variant="outline"
                  className="w-full border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 h-9 text-xs"
                >
                  <Edit className="w-3.5 h-3.5" />
                </Button>
              </Link>

              {/* DELETE */}
              <Button
                variant="outline"
                onClick={() => handleDelete(item.id)}
                className="w-full border-red-200 bg-red-50 text-red-600 hover:bg-red-100 h-9 text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
