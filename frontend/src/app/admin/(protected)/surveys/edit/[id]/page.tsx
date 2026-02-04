"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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

export default function EditSurveyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // State Data
  const [formData, setFormData] = useState({
    title: "",
    category: "Politik",
    description: "",
    thumbnail: "",
    methodology: "",
    respondents: "",
    margin_error: "",
    region: "",
    chart_labels: "",
    chart_series_name: "",
    chart_data: "",
  });

  // 1. FETCH DATA LAMA
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await surveyService.getById(id);
        const data = res.data;

        // Ambil data chart & konversi array ke string
        const series = data.chart_data.series[0] || { name: "", data: [] };
        const labelsStr = data.chart_data.labels.join(", ");
        const dataStr = series.data.join(", ");

        setFormData({
          title: data.title || "",
          category: data.category || "Politik",
          description: data.description || "",
          thumbnail: data.thumbnail || "",
          methodology: data.methodology || "",
          respondents: data.respondents || "",
          margin_error: data.margin_error || "",
          region: data.region || "",
          chart_labels: labelsStr,
          chart_series_name: series.name || "",
          chart_data: dataStr,
        });
      } catch (error) {
        console.error(error);
        alert("Gagal mengambil data survei");
        router.push("/admin/surveys");
      } finally {
        setFetching(false);
      }
    };

    if (id) loadData();
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
      if (file.size > 2 * 1024 * 1024) return alert("Max 2MB");
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData({ ...formData, thumbnail: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, thumbnail: "" });
  };

  // 2. HANDLE UPDATE
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
          series: [{ name: formData.chart_series_name, data: dataArray }],
        },
      };

      await surveyService.update(id, payload);

      alert("Survei berhasil diperbarui!");
      router.push("/admin/surveys");
    } catch (err: unknown) {
      if (err instanceof AxiosError)
        alert(err.response?.data?.error || "Gagal update");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin w-8 h-8 text-gold" />
        <p className="text-slate-500">Mengambil data...</p>
      </div>
    );

  // --- STYLE UI (Sama persis dengan Create Page) ---
  const inputStyle =
    "w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all";
  const labelStyle = "block text-sm font-bold text-slate-700 mb-2";

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* HEADER + BACK BUTTON */}
      <div className="flex items-center gap-4">
        <Link href="/admin/surveys">
          <Button variant="ghost" size="icon" className="hover:bg-slate-200">
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Edit Data Survei
          </h1>
          <p className="text-slate-500">
            Perbarui informasi riset dan data grafik.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* BAGIAN 1: INFO UMUM */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 mb-4">
            <h3 className="text-xl font-bold text-slate-800">
              1. Informasi Dasar
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
                className={inputStyle}
                placeholder="Judul survei..."
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
              placeholder="Ringkasan analisa..."
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className={labelStyle}>Gambar Cover (Opsional)</label>
            {!formData.thumbnail ? (
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-gold transition-colors">
                  <UploadCloud className="w-8 h-8" />
                  <p className="font-medium">Klik untuk ganti gambar</p>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-200 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.thumbnail}
                  className="w-full h-full object-cover"
                  alt="preview"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* BAGIAN 2: METODOLOGI */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 mb-4 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              2. Detail Metodologi
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
                className={inputStyle}
                placeholder="Ex: Multistage Random..."
              />
            </div>
            <div>
              <label className={labelStyle}>Jumlah Responden</label>
              <input
                required
                name="respondents"
                value={formData.respondents}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Ex: 1200 Orang"
              />
            </div>
            <div>
              <label className={labelStyle}>Margin of Error</label>
              <input
                required
                name="margin_error"
                value={formData.margin_error}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Ex: +/- 2.5%"
              />
            </div>
            <div>
              <label className={labelStyle}>Wilayah Survei</label>
              <input
                required
                name="region"
                value={formData.region}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Ex: 34 Provinsi"
              />
            </div>
          </div>
        </div>

        {/* BAGIAN 3: GRAFIK */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 mb-4 flex items-center gap-3">
            <div className="p-2 bg-gold/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">3. Data Grafik</h3>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 text-blue-800 text-sm rounded-lg mb-4">
            💡 <strong>Tips:</strong> Pisahkan data dengan tanda koma ( , ).
            Gunakan titik ( . ) untuk desimal.
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Label (Sumbu X)</label>
              <input
                required
                name="chart_labels"
                value={formData.chart_labels}
                onChange={handleChange}
                className={`${inputStyle} font-mono`}
                placeholder="2018, 2019, 2020"
              />
            </div>
            <div>
              <label className={labelStyle}>Data Angka (Sumbu Y)</label>
              <input
                required
                name="chart_data"
                value={formData.chart_data}
                onChange={handleChange}
                className={`${inputStyle} font-mono`}
                placeholder="10.5, 20.1, 30.5"
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
              className={inputStyle}
              placeholder="Contoh: Persentase, Ton, Jiwa"
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="h-12 px-6 border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Batal
          </Button>
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
