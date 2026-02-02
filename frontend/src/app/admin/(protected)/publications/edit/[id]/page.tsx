"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { publicationService } from "@/services/publicationService";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Save,
  Loader2,
  UploadCloud,
  X,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditPublicationPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(false); // State simpan
  const [fetching, setFetching] = useState(true); // State ambil data awal

  const [formData, setFormData] = useState({
    title: "",
    category: "Berita",
    content: "",
    thumbnail: "",
    author: "",
  });

  // 1. Fetch Data Lama saat Halaman Dibuka
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await publicationService.getById(id);

        // DEBUG: Cek di Console browser apakah datanya masuk
        console.log("Data dari Backend:", res);

        if (res && res.data) {
          // KITA PAKAI LOGIKA "OR" AGAR LEBIH AMAN (Handle huruf besar/kecil)
          const data = res.data;
          setFormData({
            title: data.title || data.Title || "",
            category: data.category || data.Category || "Berita",
            content: data.content || data.Content || "",
            thumbnail: data.thumbnail || data.Thumbnail || "",
            author: data.author || data.Author || "Admin LSI",
          });
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        alert("Artikel tidak ditemukan atau terjadi kesalahan.");
        router.push("/admin/publications");
      } finally {
        setFetching(false);
      }
    };
    loadData();
  }, [id, router]);

  // Handle Input Text
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024)
        return alert("Ukuran gambar maksimal 2MB");
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, thumbnail: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, thumbnail: "" });
  };

  // Handle Submit (Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await publicationService.update(id, formData);
      alert("Artikel berhasil diperbarui!");
      router.push("/admin/publications");
    } catch (error) {
      console.error(error);
      alert("Gagal mengupdate artikel. Cek koneksi server.");
    } finally {
      setLoading(false);
    }
  };

  // Style Helper (Sama persis dengan Create Page agar konsisten)
  const inputStyle =
    "w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all";
  const labelStyle = "block text-sm font-bold text-slate-700 mb-2";

  if (fetching) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin w-10 h-10 text-gold" />
        <span className="ml-3 text-slate-500 font-medium">
          Memuat data artikel...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* HEADER + BACK BUTTON */}
      <div className="flex items-center gap-4">
        <Link href="/admin/publications">
          <Button variant="ghost" size="icon" className="hover:bg-slate-200">
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit Artikel</h1>
          <p className="text-slate-500">Perbarui konten artikel atau berita.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* KOTAK 1: KONTEN UTAMA */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 mb-4 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Konten Artikel</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelStyle}>Judul Artikel</label>
              <input
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`${inputStyle} text-lg font-bold`}
                placeholder="Judul artikel..."
              />
            </div>

            <div>
              <label className={labelStyle}>Kategori</label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`${inputStyle} appearance-none cursor-pointer`}
                >
                  <option value="Berita">Berita</option>
                  <option value="Rilis Pers">Rilis Pers</option>
                  <option value="Artikel Opini">Artikel Opini</option>
                  <option value="Laporan">Laporan Riset</option>
                  <option value="Umum">Umum</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  ▼
                </div>
              </div>
            </div>

            <div>
              <label className={labelStyle}>Penulis</label>
              <input
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Nama Penulis"
              />
            </div>
          </div>

          <div>
            <label className={labelStyle}>Isi Artikel</label>
            <textarea
              required
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={12}
              className={inputStyle}
              placeholder="Isi konten..."
            />
          </div>
        </div>

        {/* KOTAK 2: MEDIA / GAMBAR */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 mb-4 flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              Media Pendukung
            </h3>
          </div>

          <div>
            <label className={labelStyle}>Gambar Utama</label>
            {!formData.thumbnail ? (
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center relative group hover:bg-slate-50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-purple-600">
                  <UploadCloud className="w-10 h-10" />
                  <p>Klik untuk upload gambar baru</p>
                </div>
              </div>
            ) : (
              <div className="relative w-full max-w-md h-64 rounded-xl overflow-hidden border border-slate-200 shadow-md group mx-auto md:mx-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.thumbnail}
                  className="w-full h-full object-cover"
                  alt="preview"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow hover:bg-red-600 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-4 pt-4">
          <Link href="/admin/publications">
            <Button
              type="button"
              variant="outline"
              className="h-12 px-6 border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Batal
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading}
            className="bg-gold hover:bg-gold-light text-slate-950 font-bold h-12 px-8 shadow-lg shadow-gold/20"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" /> Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
