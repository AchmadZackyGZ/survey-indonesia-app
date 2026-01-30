"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Lock, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Panggil service login
      await authService.login(formData.email, formData.password);

      // Jika sukses, arahkan ke Dashboard
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Login gagal", err);
      // Tampilkan pesan error dari backend atau default
      setError("Email atau Password salah!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md space-y-8 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
        {/* Header Logo */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-gold/20">
            <Lock className="h-6 w-6 text-gold" />
          </div>
          <h2 className="text-2xl font-bold text-white font-serif">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Silakan login untuk mengelola data LSI
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full mt-1 px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                placeholder="admin@lsi.or.id"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full mt-1 px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-light text-slate-950 font-bold py-6 text-lg"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
