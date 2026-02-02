"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { AxiosError } from "axios"; // Import AxiosError untuk handling error rapi
import { Button } from "@/components/ui/button";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State untuk pesan error

  useEffect(() => {
    // Cek apakah user sudah punya tiket masuk?
    const token = localStorage.getItem("token");

    if (token) {
      // Jika ADA token, langsung lempar ke dashboard
      // Gunakan 'replace' agar user tidak bisa back ke halaman login
      router.replace("/admin/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Reset error sebelum request

    try {
      const res = await authService.login(email, password);

      // ----------------------------------------------------
      // SOLUSI 1: SIMPAN TOKEN KE LOCAL STORAGE
      // ----------------------------------------------------
      // Backend mengirim struktur: { data: { token: "..." } }
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);

        // Simpan data user lain jika perlu (opsional)
        localStorage.setItem("adminName", res.data.name);

        // Redirect ke dashboard
        router.push("/admin/dashboard");
      } else {
        throw new Error("Token tidak ditemukan dalam respon server");
      }
    } catch (error: any) {
      console.error("Login Error:", error);

      // ----------------------------------------------------
      // SOLUSI 2: TAMPILKAN PESAN ERROR SPESIFIK
      // ----------------------------------------------------
      if (error instanceof AxiosError && error.response) {
        // Ambil pesan error dari Backend (gin.H{"error": "..."})
        const backendMsg = error.response.data.error;
        setErrorMessage(backendMsg || "Terjadi kesalahan pada server.");
      } else {
        setErrorMessage(
          "Gagal terhubung ke server. Periksa koneksi internet Anda.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-slate-900 p-8 shadow-2xl border border-slate-800">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 border border-slate-700 mb-4">
            <Lock className="h-6 w-6 text-gold" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Silakan login untuk mengelola data LSI
          </p>
        </div>

        {/* ALERT ERROR MESSAGE */}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <p className="text-sm text-red-400">{errorMessage}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-3 pl-11 text-white placeholder-slate-500 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                  placeholder="admin@lsi.or.id"
                />
                <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-500" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-3 pl-11 text-white placeholder-slate-500 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-500" />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-light text-slate-950 font-bold h-12 text-base transition-all"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
