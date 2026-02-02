"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Menu, X } from "lucide-react"; // Tambah icon Menu & X
import Sidebar from "@/components/admin/Sidebar";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State untuk Menu HP

  useEffect(() => {
    // 1. Cek Token (Logika Satpam)
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/admin/login");
    } else {
      setIsAuthorized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Loading Screen
  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin w-10 h-10 text-gold" />
          <p className="text-slate-500 text-sm font-medium">
            Memverifikasi akses...
          </p>
        </div>
      </div>
    );
  }

  // 3. Render Tampilan Admin (Responsive)
  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      {/* --- MOBILE HEADER (Hanya muncul di HP) --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 z-40 flex items-center px-4 shadow-md justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-white p-1 hover:bg-slate-800 rounded"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-gold font-bold font-serif text-lg">
            LSI ADMIN
          </span>
        </div>
        {/* Avatar kecil di mobile header (opsional) */}
        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-xs border border-gold">
          A
        </div>
      </div>

      {/* --- OVERLAY GELAP (Hanya muncul saat Menu HP terbuka) --- */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* --- SIDEBAR (Responsive) --- */}
      <aside
        className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white shadow-xl
            transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
            md:translate-x-0 
        `}
      >
        {/* Tombol Close khusus di HP (di dalam sidebar) */}
        <div className="md:hidden absolute top-4 right-4">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Komponen Sidebar Asli */}
        <div
          className="h-full overflow-y-auto"
          onClick={() => {
            // Opsional: Tutup menu saat item diklik di HP (tapi biarkan terbuka di Desktop)
            if (window.innerWidth < 768) setIsMobileMenuOpen(false);
          }}
        >
          <Sidebar />
        </div>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      {/* md:ml-64 artinya margin kiri 256px HANYA di Desktop. Di HP margin 0. */}
      {/* pt-20 artinya padding top HANYA di HP supaya konten tidak ketutup Header. */}
      <main className="flex-1 min-h-screen p-4 md:p-8 pt-20 md:pt-8 md:ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
