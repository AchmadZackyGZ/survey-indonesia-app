// LOKASI: src/app/(main)/layout.tsx
import Navbar from "@/components/layout/navbar";
import Link from "next/link";
import React from "react";

// Nanti kita ganti ini dengan import Component asli:
// import Navbar from "@/components/layout/navbar";
// import Footer from "@/components/layout/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Konten Halaman akan muncul di sini */}
      <main className="flex-grow pt-16">{children}</main>

      {/* --- SEMENTARA: FOOTER --- */}
      <footer className="bg-slate-900 border-t border-white/10 py-8 text-center text-slate-500 text-sm">
        <p>© 2026 Lembaga Survei Indonesia. All rights reserved.</p>
      </footer>
    </div>
  );
}
