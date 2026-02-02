"use client";

import { useState } from "react";
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
import { AxiosError } from "axios";

export default function CreatePublicationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State Form
  const [formData, setFormData] = useState({
    title: "",
    category: "Berita", // Default
    content: "",
    thumbnail: "", // Untuk menyimpan Base64 gambar
    author: "Admin LSI", // Default author
  });

  // Handle Input Text
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Upload (Convert to Base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi Ukuran (Max 2MB)
      if (file.size > 2 * 1024 * 1024)
        return alert("Ukuran gambar maksimal 2MB");

      const reader = new FileReader();
      reader.onloadend = () => {
        // Simpan hasil base64 ke state
        setFormData({ ...formData, thumbnail: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, thumbnail: "" });
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Kirim data ke Backend
      await publicationService.create(formData);

      alert("Artikel berhasil diterbitkan!");
      router.push("/admin/publications"); // Kembali ke list
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError) {
        alert(err.response?.data?.error || "Gagal membuat artikel");
      } else {
        alert("Terjadi kesalahan sistem");
      }
    } finally {
      setLoading(false);
    }
  };

  // Style Helper
  const inputStyle =
    "w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all";
  const labelStyle = "block text-sm font-bold text-slate-700 mb-2";

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
          <h1 className="text-3xl font-bold text-slate-900">
            Tulis Artikel Baru
          </h1>
          <p className="text-slate-500">
            Bagikan berita, rilis pers, atau analisis terbaru.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* KOTAK 1: INFO UTAMA */}
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
                placeholder="Contoh: Hasil Survei Elektabilitas Terbaru 2024..."
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
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  ▼
                </div>
              </div>
            </div>

            <div>
              <label className={labelStyle}>Penulis (Author)</label>
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
              placeholder="Ketik isi artikel di sini..."
            />
            <p className="text-xs text-slate-400 mt-2 text-right">
              *Tip: Gunakan spasi antar paragraf agar enak dibaca.
            </p>
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
            <label className={labelStyle}>Gambar Utama (Thumbnail)</label>
            {!formData.thumbnail ? (
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:bg-slate-50 transition-colors cursor-pointer relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-purple-600 transition-colors">
                  <UploadCloud className="w-10 h-10" />
                  <div>
                    <p className="font-medium text-slate-700">
                      Klik untuk upload gambar
                    </p>
                    <p className="text-xs mt-1">Format JPG/PNG, Maksimal 2MB</p>
                  </div>
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
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-all"
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
                <Save className="w-5 h-5 mr-2" /> Terbitkan Artikel
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
