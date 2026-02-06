"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { teamService, TeamMember } from "@/services/teamService";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Target,
  User,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
// 1. IMPORT TIPE DARI EMBLA CAROUSEL
import { EmblaCarouselType } from "embla-carousel";

export default function TentangKamiPage() {
  const [teams, setTeams] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // --- CONFIG CAROUSEL ---
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // 1. Fetch Data
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

  // 2. Carousel Logic (Dots & Navigation)
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // --- PERBAIKAN TIPE DATA DI SINI (Ganti 'any' dengan 'EmblaCarouselType') ---
  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

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
          {/* Ilustrasi */}
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

      {/* 3. DEWAN PAKAR (SLIDER VERSION) */}
      <section className="py-20 bg-slate-900 border-y border-slate-800 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-serif font-bold text-white mb-4">
                Dewan Pakar
              </h2>
              <p className="text-slate-400">
                Didukung oleh para akademisi dan peneliti berpengalaman di
                bidangnya masing-masing.
              </p>
            </div>

            {/* Tombol Navigasi Desktop */}
            <div className="hidden md:flex gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollPrev}
                className="rounded-full border-slate-700 hover:bg-gold hover:border-gold hover:text-slate-950 transition-colors w-12 h-12"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollNext}
                className="rounded-full border-slate-700 hover:bg-gold hover:border-gold hover:text-slate-950 transition-colors w-12 h-12"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          ) : teams.length > 0 ? (
            <>
              {/* --- CAROUSEL AREA --- */}
              <div className="relative">
                <div
                  className="overflow-hidden cursor-grab active:cursor-grabbing"
                  ref={emblaRef}
                >
                  <div className="flex -ml-6 py-4">
                    {teams.map((item) => (
                      <div
                        key={item.id}
                        className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0 pl-6"
                      >
                        <Link
                          href={`/tentang-kami/tim/${item.id}`}
                          className="block h-full"
                        >
                          <div className="group h-full p-8 rounded-2xl bg-navy-950 border border-slate-800 hover:border-gold/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gold/5 flex flex-col items-center text-center relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="w-32 h-32 mx-auto bg-slate-800 rounded-full mb-6 overflow-hidden border-4 border-slate-800 group-hover:border-gold transition-colors shadow-lg relative z-10">
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

                            <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors mb-2">
                              {item.name}
                            </h3>
                            <p className="text-gold/80 font-medium text-sm mb-4 uppercase tracking-wider">
                              {item.role}
                            </p>

                            <p className="text-slate-400 text-sm line-clamp-3 mb-6">
                              {item.bio}
                            </p>

                            <div className="mt-auto pt-4 border-t border-slate-800 w-full flex justify-center">
                              <span className="text-xs font-bold text-gold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                                Lihat Profil Lengkap &rarr;
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* --- DOTS INDICATOR --- */}
              <div className="flex justify-center items-center gap-2 mt-8">
                {scrollSnaps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === selectedIndex
                        ? "bg-gold w-8"
                        : "bg-slate-700 hover:bg-slate-600"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Navigasi Mobile */}
              <div className="flex md:hidden justify-center gap-4 mt-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollPrev}
                  className="rounded-full border-slate-700 hover:bg-slate-800"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-400" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollNext}
                  className="rounded-full border-slate-700 hover:bg-slate-800"
                >
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </Button>
              </div>
            </>
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
