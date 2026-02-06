"use client"; // Ubah jadi Client Component karena ada interaksi form

import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Loader2, CheckCircle } from "lucide-react";
import api from "@/lib/axios"; // Import Axios kita

export default function KontakPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // State untuk Form
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    subject: "Permintaan Survei",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Kirim ke Backend Go
      await api.post("/contacts", formData);
      setIsSuccess(true);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        subject: "",
        message: "",
      }); // Reset form
    } catch (error) {
      console.error("Gagal kirim pesan", error);
      alert("Maaf, terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-300 pt-10 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* ... (HEADER & KOLOM KIRI BIARKAN SAMA SEPERTI SEBELUMNYA) ... */}

        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-white mb-4">
            Hubungi Kami
          </h1>
          <p className="text-slate-400">
            Silakan kirimkan pesan atau pertanyaan Anda.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* ... Kolom Kiri (Info Kontak & Maps) Paste Disini ... */}
          <div className="space-y-8">
            {/* (Copy paste bagian Info Kontak & Map dari kode sebelumnya disini) */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className="text-xl font-bold text-white mb-6">
                Kantor Pusat
              </h3>
              {/* ... isi info kontak ... */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-gold" />
                  <div>
                    <p className="text-white font-medium">+62 21 315 2244</p>
                  </div>
                </div>
                {/* ... dst ... */}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: Form Pesan (YANG KITA UPDATE) */}
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm h-fit">
            {isSuccess ? (
              <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h3 className="text-2xl font-bold text-white">
                  Pesan Terkirim!
                </h3>
                <p className="text-slate-400">
                  Terima kasih telah menghubungi kami. Tim kami akan segera
                  membalas email Anda.
                </p>
                <Button
                  onClick={() => setIsSuccess(false)}
                  variant="outline"
                  className="mt-4"
                >
                  Kirim Pesan Lain
                </Button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white mb-6">
                  Kirim Pesan
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">
                        Nama Depan
                      </label>
                      <input
                        required
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        type="text"
                        className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-gold focus:outline-none"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">
                        Nama Belakang
                      </label>
                      <input
                        required
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        type="text"
                        className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-gold focus:outline-none"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                      Email
                    </label>
                    <input
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-gold focus:outline-none"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                      Subjek
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-gold focus:outline-none"
                    >
                      <option value="Permintaan Survei">
                        Permintaan Survei
                      </option>
                      <option value="Media & Pers">Media & Pers</option>
                      <option value="Karir">Karir</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                      Pesan
                    </label>
                    <textarea
                      required
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-gold focus:outline-none h-32 resize-none"
                      placeholder="Tulis pesan Anda disini..."
                    ></textarea>
                  </div>

                  <Button
                    disabled={isLoading}
                    className="w-full bg-gold hover:bg-gold-light text-slate-950 font-bold h-12 mt-4"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin mr-2" />
                    ) : (
                      "Kirim Pesan"
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
