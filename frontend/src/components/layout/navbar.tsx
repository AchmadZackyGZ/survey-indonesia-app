import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* LOGO AREA - Tipografi Elegan */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-serif text-xl font-bold tracking-wide text-white">
              LSI
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-gold-light">
              Lembaga Survei Indonesia
            </span>
          </Link>
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-gold transition-colors">
            Beranda
          </Link>
          <Link
            href="/pusat-data"
            className="hover:text-gold transition-colors"
          >
            Hasil Survei
          </Link>
          <Link href="/publikasi" className="hover:text-gold transition-colors">
            Publikasi
          </Link>
          <Link
            href="/tentang-kami"
            className="hover:text-gold transition-colors"
          >
            Tentang Kami
          </Link>
        </nav>

        {/* ACTION BUTTON */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/kontak">
            <Button className="bg-gold hover:bg-gold-light text-slate-950 font-bold px-6">
              Hubungi Kami
            </Button>
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE (Simpel dulu) */}
        <button className="md:hidden text-white">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
