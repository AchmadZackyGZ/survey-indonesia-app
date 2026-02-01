"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { surveyService, Survey } from "@/services/surveyService";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Eye, Loader2, Calendar, Pencil } from "lucide-react";
import { AxiosError } from "axios";

export default function AdminSurveyPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data saat halaman dibuka
  const fetchSurveys = async () => {
    try {
      // Kita pakai getAll yang lama (pagination default).
      // Nanti bisa diupdate parameter limit-nya biar muncul semua (misal limit=100)
      const res = await surveyService.getAll(1, 100);
      if (res.data) {
        setSurveys(res.data);
      }
    } catch (error) {
      console.error("Gagal load survei:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  // 2. Handle Delete
  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Apakah Anda yakin ingin menghapus survei ini? Data akan hilang permanen.",
      )
    )
      return;

    try {
      await surveyService.deleteSurvey(id);
      // Refresh data setelah hapus (hapus dari state biar ga perlu reload page)
      setSurveys((prev) => prev.filter((item) => item.id !== id));
      alert("Data berhasil dihapus!");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        alert(err.response?.data?.message || "Gagal menghapus data");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data Survei</h1>
          <p className="text-slate-500">Kelola hasil riset dan polling.</p>
        </div>
        <Link href="/admin/surveys/create">
          <Button className="bg-gold hover:bg-gold-light text-slate-950 font-bold">
            <Plus className="w-4 h-4 mr-2" /> Buat Survei Baru
          </Button>
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="animate-spin text-gold w-8 h-8" />
          </div>
        ) : surveys.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            Belum ada data survei. Silakan buat baru.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-700">
                    Judul Survei
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-700">
                    Kategori
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-700">
                    Tanggal Rilis
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-700 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {surveys.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {item.description}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.published_at).toLocaleDateString(
                          "id-ID",
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Link ke halaman detail publik (preview) */}
                        <Link href={`/pusat-data/${item.slug}`} target="_blank">
                          <Button
                            size="sm"
                            variant="outline"
                            title="Lihat Preview"
                          >
                            <Eye className="w-4 h-4 text-slate-600" />
                          </Button>
                        </Link>

                        {/* --- TOMBOL EDIT BARU --- */}
                        <Link href={`/admin/surveys/edit/${item.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                            title="Edit Data"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        {/* ------------------------ */}

                        {/* Tombol Hapus */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 bg-red-50 hover:bg-red-100 text-red-600"
                          onClick={() => handleDelete(item.id)}
                          title="Hapus Data"
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
        )}
      </div>
    </div>
  );
}
