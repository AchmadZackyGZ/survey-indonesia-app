"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { surveyService, Survey } from "@/services/surveyService";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Loader2,
  BarChart3,
  AlertCircle,
} from "lucide-react";

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadSurveys = async () => {
    try {
      const res = await surveyService.getAll();
      setSurveys(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSurveys();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus survei ini?")) {
      await surveyService.deleteSurvey(id);
      loadSurveys();
    }
  };

  const filteredSurveys = surveys.filter((item) =>
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
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data Survei</h1>
          <p className="text-slate-500 text-sm">
            Kelola hasil riset dan data polling Anda.
          </p>
        </div>
        <Link href="/admin/surveys/create">
          <Button className="w-full md:w-auto bg-gold hover:bg-gold-light text-slate-950 font-bold shadow-lg shadow-gold/20">
            <Plus className="w-4 h-4 mr-2" /> Buat Survei Baru
          </Button>
        </Link>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul survei..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-sm text-slate-900"
          />
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredSurveys.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">
            Tidak ada data survei ditemukan.
          </p>
        </div>
      )}

      {/* TABLE VIEW (DESKTOP) - SUDAH DITAMBAHKAN KOLOM GAMBAR */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-xs font-semibold">
            <tr>
              <th className="p-4 w-16 text-center">No</th>
              <th className="p-4 w-24">Cover</th>
              <th className="p-4">Judul Survei</th>
              <th className="p-4 w-32">Kategori</th>
              <th className="p-4 w-40">Tanggal</th>
              <th className="p-4 w-40 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSurveys.map((item, index) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50 transition-colors group"
              >
                <td className="p-4 text-center text-slate-400">{index + 1}</td>
                <td className="p-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                    {item.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.thumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-bold text-slate-800 line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {item.description}
                  </p>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    {item.category}
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
                    <Link href={`/pusat-data/${item.slug}`} target="_blank">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-slate-200 text-slate-500"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/surveys/edit/${item.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-blue-50 text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="h-8 w-8 hover:bg-red-50 text-red-600"
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

      {/* CARD VIEW (MOBILE) */}
      <div className="md:hidden grid gap-4">
        {filteredSurveys.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4"
          >
            <div className="flex gap-4">
              {/* Gambar di Mobile */}
              <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                {item.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div>
                <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold uppercase tracking-wide mb-2">
                  {item.category}
                </span>
                <h3 className="font-bold text-slate-900 leading-snug line-clamp-2">
                  {item.title}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <Link href={`/pusat-data/${item.slug}`} className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-slate-200 text-slate-600 h-10"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </Link>
              <Link href={`/admin/surveys/edit/${item.id}`} className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 h-10"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => handleDelete(item.id)}
                className="w-full border-red-200 bg-red-50 text-red-600 hover:bg-red-100 h-10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
