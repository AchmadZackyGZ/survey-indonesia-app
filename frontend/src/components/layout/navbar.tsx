"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // <--- IMPOR PENTING
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // <--- Ambil URL saat ini

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Hasil Survei", href: "/pusat-data" },
    { name: "Publikasi", href: "/publikasi" },
    { name: "Tentang Kami", href: "/tentang-kami" },
  ];

  // Fungsi Cek Apakah Link Aktif
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"; // Khusus Beranda harus sama persis
    }
    return pathname.startsWith(path); // Halaman lain (misal /pusat-data/slug) tetap dianggap aktif
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950 border-b border-slate-900 shadow-md">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          {/* LOGO */}
          <Link
            href="/"
            className="flex flex-col group"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-2xl font-serif font-bold text-white tracking-wide group-hover:text-gold transition-colors">
              LSI
            </span>
            <span className="text-[10px] text-gold font-medium tracking-[0.2em] uppercase">
              Lembaga Survei Indonesia
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors relative group ${
                  isActive(link.href)
                    ? "text-gold font-bold" // Kalo Aktif: Warna Emas
                    : "text-slate-300 hover:text-gold" // Kalo Tidak: Putih Abu
                }`}
              >
                {link.name}
                {/* Garis Bawah (Underline) */}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gold transition-all ${
                    isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            ))}
            <Link href="/hubungi-kami">
              <Button className="bg-gold hover:bg-gold-light text-slate-950 font-bold px-6">
                Hubungi Kami
              </Button>
            </Link>
          </div>

          {/* MOBILE TOGGLE BUTTON */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
            onClick={toggleMenu}
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU CONTENT */}
      {isOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 absolute w-full left-0 top-20 shadow-2xl animate-in slide-in-from-top-5">
          <div className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-lg font-medium transition-all border-b border-slate-900 pb-2 ${
                  isActive(link.href)
                    ? "text-gold pl-2 border-l-4 border-l-gold bg-slate-900" // Aktif di HP
                    : "text-slate-300 hover:text-gold hover:pl-2"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-2">
              <Link href="/hubungi-kami" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-gold hover:bg-gold-light text-slate-950 font-bold h-12 text-lg">
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
