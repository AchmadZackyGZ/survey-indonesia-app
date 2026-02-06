"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { teamService } from "@/services/teamService";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Loader2,
  Upload,
  User,
  X,
  Linkedin,
  Save,
} from "lucide-react";

export default function EditTeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    linkedin: "",
    photo_url: "",
  });

  // 1. Fetch Data Lama Saat Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await teamService.getById(id);
        if (res.data) {
          setFormData({
            name: res.data.name,
            role: res.data.role,
            bio: res.data.bio,
            linkedin: res.data.linkedin || "",
            photo_url: res.data.photo_url,
          });
        }
      } catch (error) {
        console.error("Gagal memuat data:", error);
        alert("Data tidak ditemukan.");
        router.push("/admin/teams");
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file terlalu besar! Maksimal 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photo_url: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, photo_url: "" }));
  };

  // 2. Submit Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await teamService.update(id, formData);
      router.push("/admin/teams");
    } catch (error) {
      console.error("Gagal update:", error);
      alert("Terjadi kesalahan saat mengupdate data.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/teams">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 border-slate-300"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Edit Anggota Tim
          </h1>
          <p className="text-slate-500 text-sm">
            Perbarui informasi profil anggota.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* UPLOAD FOTO */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Foto Profil <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 group">
                {formData.photo_url ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.photo_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="text-white w-6 h-6" />
                    </button>
                  </>
                ) : (
                  <User className="w-10 h-10 text-slate-300" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="photo-upload-edit"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="photo-upload-edit"
                  className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Ganti Foto
                </label>
                <p className="mt-2 text-xs text-slate-500">
                  Klik tombol di atas untuk mengganti foto.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                // FIX: Tambahkan text-slate-900 bg-white
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Jabatan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                // FIX: Tambahkan text-slate-900 bg-white
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Biografi <span className="text-red-500">*</span>
            </label>
            <textarea
              name="bio"
              required
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              // FIX: Tambahkan text-slate-900 bg-white
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-blue-600" /> Profil LinkedIn
              </label>
              <span className="text-xs text-slate-400 font-medium px-2 py-0.5 bg-slate-100 rounded">
                Opsional
              </span>
            </div>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/..."
              // FIX: Tambahkan text-slate-900 bg-white
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            />
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <Link href="/admin/teams">
              <Button
                type="button"
                variant="outline"
                className="border-slate-300 text-slate-700"
              >
                Batal
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading || !formData.photo_url}
              className="bg-gold hover:bg-gold-light text-slate-950 font-bold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
