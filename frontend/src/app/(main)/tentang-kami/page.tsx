import { Button } from "@/components/ui/button";
import { CheckCircle2, Target, Users } from "lucide-react";
import Link from "next/link";

export default function TentangKamiPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-300">
      {/* 1. HERO SECTION (Simple) */}
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
              Filosofi Kami
            </span>
            <h2 className="text-3xl font-serif font-bold text-white mb-6">
              Akurasi adalah Mata Uang Kami
            </h2>
            <p className="mb-6 leading-relaxed">
              Kami percaya bahwa data yang buruk akan menghasilkan keputusan
              yang buruk. Oleh karena itu, LSI menerapkan standar metodologi
              riset yang ketat Gold Standard yang diakui secara internasional.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Target className="w-6 h-6 text-gold shrink-0" />
                <div>
                  <h4 className="text-white font-bold">Integritas Akademik</h4>
                  <p className="text-sm">
                    Menjaga independensi dari kepentingan politik praktis.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-gold shrink-0" />
                <div>
                  <h4 className="text-white font-bold">Metodologi Teruji</h4>
                  <p className="text-sm">
                    Menggunakan Multistage Random Sampling yang representatif.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Placeholder */}
          <div className="relative h-[400px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-800">
            {/* Gunakan img biasa agar praktis */}
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80"
              alt="Team Meeting"
              className="object-cover w-full h-full opacity-80 hover:opacity-100 transition-opacity duration-700"
            />
          </div>
        </div>
      </section>

      {/* 3. TIM AHLI (Static Grid) */}
      <section className="py-20 bg-slate-900 border-y border-slate-800">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-12">
            Dewan Pakar
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Expert 1 */}
            <div className="p-6 rounded-xl bg-navy-950 border border-slate-800 hover:border-gold/50 transition-colors group">
              <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full mb-4 overflow-hidden border-2 border-gold/20 group-hover:border-gold">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white">
                Dr. Saiful Mujani
              </h3>
              <p className="text-gold text-sm mb-3">
                Founder & Principal Researcher
              </p>
              <p className="text-xs text-slate-500">
                Guru Besar Ilmu Politik dengan pengalaman riset lebih dari 20
                tahun.
              </p>
            </div>

            {/* Expert 2 */}
            <div className="p-6 rounded-xl bg-navy-950 border border-slate-800 hover:border-gold/50 transition-colors group">
              <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full mb-4 overflow-hidden border-2 border-gold/20 group-hover:border-gold">
                <img
                  src="https://images.unsplash.com/photo-1573496359-0cf84flc527e?auto=format&fit=crop&q=80"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white">
                Prof. Sarah Kusuma
              </h3>
              <p className="text-gold text-sm mb-3">Direktur Eksekutif</p>
              <p className="text-xs text-slate-500">
                Ahli statistik sosial dan perilaku pemilih di Indonesia.
              </p>
            </div>

            {/* Expert 3 */}
            <div className="p-6 rounded-xl bg-navy-950 border border-slate-800 hover:border-gold/50 transition-colors group">
              <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full mb-4 overflow-hidden border-2 border-gold/20 group-hover:border-gold">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white">
                Budi Santoso, M.Si
              </h3>
              <p className="text-gold text-sm mb-3">Senior Analyst</p>
              <p className="text-xs text-slate-500">
                Spesialisasi dalam survei kebijakan publik dan ekonomi mikro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-6">
          Ingin Bekerjasama dengan Kami?
        </h2>
        <Link href="/hubungi-kami">
          <Button
            size="lg"
            className="bg-gold text-slate-950 hover:bg-gold-light font-bold"
          >
            Hubungi Kami
          </Button>
        </Link>
      </section>
    </div>
  );
}
