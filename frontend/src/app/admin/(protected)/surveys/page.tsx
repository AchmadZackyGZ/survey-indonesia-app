"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { surveyService, Survey } from "@/services/surveyService";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce"; // 1. Import Debounce
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  BarChart3,
  Calendar,
  AlertCircle,
  Eye,
  ChevronLeft, // Icon Baru
  ChevronRight, // Icon Baru
} from "lucide-react";

interface MetaData {
  page: number;
  limit: number;
  total_pages: number;
  total_data: number;
}

interface SurveyApiResponse {
  status: string;
  data: Survey[];
  meta?: MetaData; // Tanda tanya (?) artinya optional, jaga-jaga kalau backend lupa kirim
}

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  // State Pagination & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // Kita batasi 10 agar pagination terlihat

  // 2. Pasang Debounce (Jeda 500ms agar hemat resource server)
  const debouncedSearch = useDebounce(searchQuery, 500);

  // 1. Reset ke Halaman 1 jika user mencari sesuatu
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // 3. Fetch Data (Server-Side Search)
  const loadData = async () => {
    setLoading(true);
    try {
      // Panggil API dengan parameter Page & Limit yang dinamis
      // Response API kita: { data: [...], meta: { total_pages: ... } }
      const res = (await surveyService.getAll(
        currentPage,
        itemsPerPage,
        debouncedSearch,
      )) as SurveyApiResponse;
      setSurveys(res.data || []);
      // Ambil info total halaman dari backend (meta)
      if (res.meta) {
        setTotalPages(res.meta.total_pages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Effect: Reload saat Search berubah ATAU Halaman berubah
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, currentPage]);
  const handleDelete = async (id: string) => {
    if (
      confirm("Yakin ingin menghapus survei ini? Data tidak bisa dikembalikan.")
    ) {
      await surveyService.deleteSurvey(id); // Pastikan pakai deleteSurvey (sesuai service)
      loadData();
    }
  };

  // Fungsi Navigasi Halaman
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* --- HEADER --- */}
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

      {/* --- SEARCH BAR --- */}
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

      {/* --- LOADING STATE --- */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin w-8 h-8 text-gold" />
        </div>
      ) : (
        <>
          {/* --- EMPTY STATE --- */}
          {surveys.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">
                Belum ada data survei.
              </p>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAMPILAN 1: TABLE VIEW (DESKTOP ONLY)                     */}
          {/* ========================================================= */}
          {surveys.length > 0 && (
            <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-xs font-semibold">
                  <tr>
                    <th className="p-4 w-16 text-center">No</th>
                    <th className="p-4 w-24">Cover</th>
                    <th className="p-4">Judul Survei</th>
                    <th className="p-4 w-32">Kategori</th>
                    <th className="p-4 w-40">Tanggal</th>
                    <th className="p-4 w-32 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {surveys.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="p-4 text-center text-slate-400">
                        {index + 1}
                      </td>
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
                        <span className="font-bold text-slate-800 line-clamp-2">
                          {item.title}
                        </span>
                        <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">
                          {item.slug}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
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
                          {/* VIEW BUTTON */}
                          <Link
                            href={`/pusat-data/${item.slug}`}
                            target="_blank"
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-slate-200 text-slate-500"
                              title="Lihat"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>

                          {/* EDIT BUTTON */}
                          <Link href={`/admin/surveys/edit/${item.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-blue-50 text-blue-600"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>

                          {/* DELETE BUTTON */}
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
          )}

          {/* ========================================================= */}
          {/* TAMPILAN 2: CARD VIEW (MOBILE ONLY)                       */}
          {/* ========================================================= */}
          <div className="md:hidden grid gap-4">
            {surveys.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4"
              >
                {/* Header Card */}
                <div className="flex gap-3">
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
                        <BarChart3 />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-1 inline-block">
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

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                  <Link
                    href={`/pusat-data/${item.slug}`}
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

                  <Link
                    href={`/admin/surveys/edit/${item.id}`}
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      className="w-full border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 h-9 text-xs"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                  </Link>

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

          {/* --- 2. PAGINATION CONTROLS (STYLING DIPERBAIKI) --- */}
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500">
              Halaman{" "}
              <span className="font-bold text-slate-900">{currentPage}</span>{" "}
              dari {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={currentPage === 1}
                // Kita perjelas warnanya: border lebih gelap, text lebih gelap
                // dan saat disabled opacity-nya 50% (bukan hilang)
                className="h-9 px-4 border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentPage >= totalPages}
                className="h-9 px-4 border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
