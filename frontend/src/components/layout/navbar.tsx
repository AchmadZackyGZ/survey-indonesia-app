"use client"; // <--- WAJIB ADA karena kita pakai hook usePathname

import Link from "next/link";
import { usePathname } from "next/navigation"; // Hook untuk cek URL
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname(); // Ambil URL saat ini

  // Fungsi Helper untuk menentukan style link
  const getLinkClass = (path: string) => {
    // Style dasar (transisi halus)
    const baseStyle = "transition-colors duration-300 hover:text-gold";

    // Logika Active State:
    // 1. Khusus Home ('/'), harus persis sama
    if (path === "/" && pathname === "/") {
      return `${baseStyle} text-gold font-bold`;
    }

    // 2. Halaman lain, cek apakah URL diawali dengan path link (agar sub-menu tetap aktif)
    // Contoh: buka /pusat-data/detail, menu /pusat-data tetap nyala
    if (path !== "/" && pathname.startsWith(path)) {
      return `${baseStyle} text-gold font-bold`;
    }

    // 3. Jika tidak aktif, warna abu-abu
    return `${baseStyle} text-slate-300`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* LOGO AREA */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex flex-col leading-none group">
            <span className="font-serif text-xl font-bold tracking-wide text-white group-hover:text-gold transition-colors">
              LSI
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-gold-light group-hover:text-white transition-colors">
              Lembaga Survei Indonesia
            </span>
          </Link>
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className={getLinkClass("/")}>
            Beranda
          </Link>
          <Link href="/pusat-data" className={getLinkClass("/pusat-data")}>
            Hasil Survei
          </Link>
          <Link href="/publikasi" className={getLinkClass("/publikasi")}>
            Publikasi
          </Link>
          <Link href="/tentang-kami" className={getLinkClass("/tentang-kami")}>
            Tentang Kami
          </Link>
        </nav>

        {/* ACTION BUTTON */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/kontak">
            <Button className="bg-gold hover:bg-gold-light text-slate-950 font-bold px-6 transition-all hover:scale-105">
              Hubungi Kami
            </Button>
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button className="md:hidden text-white hover:text-gold transition-colors">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
