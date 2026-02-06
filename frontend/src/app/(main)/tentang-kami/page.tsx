"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { teamService, TeamMember } from "@/services/teamService";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Target,
  Users,
  Linkedin,
  Loader2,
  User,
} from "lucide-react";

export default function TentangKamiPage() {
  const [teams, setTeams] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data dari Database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await teamService.getAll();
        setTeams(res.data || []);
      } catch (error) {
        console.error("Gagal memuat tim:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-navy-950 text-slate-300">
      {/* 1. HERO SECTION */}
      <section className="relative py-24 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            Membangun Demokrasi Berbasis Data
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-slate-400 leading-relaxed">
            Lembaga Survei Indonesia (LSI) adalah institusi riset independen
            yang mendedikasikan diri untuk mengungkapkan aspirasi publik secara
            akurat demi pengambilan kebijakan yang tepat sasaran.
          </p>
        </div>
      </section>

      {/* 2. VISI & MISI */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-gold font-bold tracking-widest uppercase text-sm mb-2 block">
              Tentang Kami
            </span>
            <h2 className="text-3xl font-bold text-white mb-6">
              Visi & Misi Kami
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <Target className="w-8 h-8 text-gold flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-white text-lg">Visi</h3>
                  <p className="text-slate-400">
                    Menjadi barometer opini publik yang paling terpercaya dan
                    berpengaruh di Indonesia.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-8 h-8 text-gold flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-white text-lg">Misi</h3>
                  <ul className="space-y-2 mt-2">
                    <li className="flex items-center gap-2 text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                      Menyediakan data riset berkualitas tinggi.
                    </li>
                    <li className="flex items-center gap-2 text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                      Mendorong pengambilan kebijakan berbasis bukti.
                    </li>
                    <li className="flex items-center gap-2 text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                      Memberikan edukasi politik kepada publik.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* Ilustrasi Visi Misi */}
          <div className="relative h-[400px] rounded-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent z-10" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80"
              alt="Team Meeting"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* 3. DEWAN PAKAR (DINAMIS DARI DATABASE) */}
      <section className="py-20 bg-slate-900 border-y border-slate-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-white mb-4">
              Dewan Pakar
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Didukung oleh para akademisi dan peneliti berpengalaman di
              bidangnya masing-masing.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          ) : teams.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teams.map((item) => (
                <Link
                  href={`/tentang-kami/tim/${item.id}`}
                  key={item.id}
                  className="group block"
                >
                  <div className="p-8 rounded-2xl bg-navy-950 border border-slate-800 hover:border-gold/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gold/5 flex flex-col items-center text-center h-full">
                    {/* Foto Profil */}
                    <div className="w-32 h-32 mx-auto bg-slate-800 rounded-full mb-6 overflow-hidden border-4 border-slate-800 group-hover:border-gold transition-colors shadow-lg">
                      {item.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.photo_url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          <User className="w-12 h-12" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gold/80 font-medium text-sm mb-4 uppercase tracking-wider">
                      {item.role}
                    </p>

                    {/* Cuplikan Bio */}
                    <p className="text-slate-400 text-sm line-clamp-3 mb-6">
                      {item.bio}
                    </p>

                    {/* Tombol Lihat Profil (Fake Button for UI) */}
                    <div className="mt-auto pt-4 border-t border-slate-800 w-full flex justify-center gap-4">
                      <span className="text-xs font-bold text-gold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                        Lihat Profil Lengkap &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 py-10 border border-dashed border-slate-800 rounded-xl">
              Belum ada data dewan pakar.
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-6">
          Ingin Bekerjasama dengan Kami?
        </h2>
        <Link href="/hubungi-kami">
          <Button className="bg-gold hover:bg-gold-light text-slate-950 font-bold px-8 h-12 text-lg">
            Hubungi Kami
          </Button>
        </Link>
      </section>
    </div>
  );
}
