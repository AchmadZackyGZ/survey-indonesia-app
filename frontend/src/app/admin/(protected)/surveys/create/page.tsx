"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { surveyService } from "@/services/surveyService";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Save,
  Loader2,
  BarChart3,
  UploadCloud,
  X,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { AxiosError } from "axios";

export default function CreateSurveyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State untuk Data Formulir
  const [formData, setFormData] = useState({
    title: "",
    category: "Politik",
    description: "",
    thumbnail: "",
    methodology: "Multistage Random Sampling", // Default
    respondents: "1200",
    margin_error: "2.9%",
    region: "34 Provinsi",
    chart_labels: "",
    chart_series_name: "Persentase",
    chart_data: "",
  });

  // Handle Input Teks Biasa
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Upload Gambar (Convert ke Base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi ukuran (Max 2MB agar database tidak berat)
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar! Maksimal 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Simpan hasil konversi gambar ke state thumbnail
        setFormData({ ...formData, thumbnail: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Hapus Gambar
  const removeImage = () => {
    setFormData({ ...formData, thumbnail: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const labelsArray = formData.chart_labels
        .split(",")
        .map((item) => item.trim());
      const dataArray = formData.chart_data
        .split(",")
        .map((item) => parseFloat(item.trim()));

      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        thumbnail: formData.thumbnail || undefined,
        methodology: formData.methodology,
        respondents: formData.respondents,
        margin_error: formData.margin_error,
        region: formData.region,
        chart_data: {
          labels: labelsArray,
          series: [
            {
              name: formData.chart_series_name,
              data: dataArray,
            },
          ],
        },
      };

      await surveyService.create(payload);

      alert("Survei berhasil diterbitkan!");
      router.push("/admin/surveys");
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError) {
        alert(err.response?.data?.error || "Gagal menyimpan data");
      } else {
        alert("Terjadi kesalahan sistem");
      }
    } finally {
      setLoading(false);
    }
  };

  // Class Style standar untuk input agar rapi & terlihat
  const inputStyle =
    "w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all";
  const labelStyle = "block text-sm font-bold text-slate-700 mb-2";

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/surveys">
          <Button variant="ghost" size="icon" className="hover:bg-slate-200">
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Buat Survei Baru
          </h1>
          <p className="text-slate-500">Lengkapi data riset di bawah ini.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* BAGIAN 1: INFO UMUM */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 mb-4">
            <h3 className="text-xl font-bold text-slate-800">
              Informasi Dasar
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Judul Survei</label>
              <input
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                type="text"
                className={inputStyle}
                placeholder="Contoh: Elektabilitas Capres 2026"
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
                  <option value="Politik">Politik</option>
                  <option value="Ekonomi">Ekonomi</option>
                  <option value="Sosial">Sosial</option>
                </select>
                {/* Custom Arrow Icon for Select */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className={labelStyle}>Deskripsi / Analisa</label>
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className={inputStyle}
              placeholder="Tuliskan ringkasan analisa survei, metodologi, dan kesimpulan utama..."
            ></textarea>
          </div>

          {/* UPLOAD GAMBAR */}
          <div>
            <label className={labelStyle}>Gambar Cover (Opsional)</label>

            {!formData.thumbnail ? (
              // Tampilan Belum Upload
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-gold transition-colors">
                  <div className="p-4 bg-slate-100 rounded-full group-hover:bg-gold/10">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <p className="font-medium">
                    Klik untuk upload gambar dari laptop
                  </p>
                  <p className="text-xs text-slate-400">
                    Format: JPG, PNG (Max 2MB)
                  </p>
                </div>
              </div>
            ) : (
              // Tampilan Preview Setelah Upload
              <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-200 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.thumbnail}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                {/* Tombol Hapus */}
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-md text-sm backdrop-blur-sm">
                  Gambar berhasil dimuat
                </div>
              </div>
            )}
          </div>
        </div>

        {/*  DETAIL METODOLOGI (BARU) */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 mb-4 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              Detail Metodologi
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Metode Sampling</label>
              <input
                required
                name="methodology"
                value={formData.methodology}
                onChange={handleChange}
                type="text"
                className={inputStyle}
                placeholder="Multistage Random Sampling"
              />
            </div>
            <div>
              <label className={labelStyle}>Jumlah Responden</label>
              <input
                required
                name="respondents"
                value={formData.respondents}
                onChange={handleChange}
                type="text"
                className={inputStyle}
                placeholder="1200 Orang"
              />
            </div>
            <div>
              <label className={labelStyle}>Margin of Error</label>
              <input
                required
                name="margin_error"
                value={formData.margin_error}
                onChange={handleChange}
                type="text"
                className={inputStyle}
                placeholder="+/- 2.9%"
              />
            </div>
            <div>
              <label className={labelStyle}>Wilayah Survei</label>
              <input
                required
                name="region"
                value={formData.region}
                onChange={handleChange}
                type="text"
                className={inputStyle}
                placeholder="34 Provinsi"
              />
            </div>
          </div>
        </div>

        {/* BAGIAN 2: CHART BUILDER */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 mb-4 flex items-center gap-3">
            <div className="p-2 bg-gold/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              Input Data Grafik
            </h3>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 text-blue-800 text-sm rounded-lg flex gap-3">
            <span className="text-xl">💡</span>
            <div>
              <strong>Aturan Format Angka:</strong>
              <ul className="list-disc ml-4 mt-1">
                <li>
                  Gunakan <strong>Koma ( , )</strong> untuk memisahkan data
                  baru.
                </li>
                <li>
                  Gunakan <strong>Titik ( . )</strong> untuk angka desimal/koma.
                </li>
                <li>
                  Contoh: <code>45.5, 30.2, 100.05</code>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Label (Sumbu X)</label>
              <input
                required
                name="chart_labels"
                value={formData.chart_labels}
                onChange={handleChange}
                type="text"
                className={`${inputStyle} font-mono`}
                placeholder="Contoh: Kandidat A, Kandidat B, Tidak Tahu"
              />
            </div>

            <div>
              <label className={labelStyle}>Data Angka (Sumbu Y)</label>
              <input
                required
                name="chart_data"
                value={formData.chart_data}
                onChange={handleChange}
                type="text"
                className={`${inputStyle} font-mono`}
                placeholder="Contoh: 45.5, 30.2, 24.3"
              />
            </div>
          </div>

          <div>
            <label className={labelStyle}>Nama Satuan (Series Name)</label>
            <input
              required
              name="chart_series_name"
              value={formData.chart_series_name}
              onChange={handleChange}
              type="text"
              className={inputStyle}
              placeholder="Contoh: Persentase (%), Jumlah Suara, dll."
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 px-6 h-12 text-base font-bold"
          >
            Batal
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="bg-gold hover:bg-gold-light text-slate-950 font-bold px-8 h-12 text-base shadow-lg shadow-gold/20"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" /> Terbitkan Survei
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
