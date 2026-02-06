"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { teamService, TeamMember } from "@/services/teamService";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Linkedin, Loader2, User, Award } from "lucide-react";

export default function DetailTeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  // Ambil ID dari URL
  const { id } = use(params);

  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await teamService.getById(id);
        if (res.data) {
          setMember(res.data);
        }
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-slate-400">
        <p className="mb-4">Profil tidak ditemukan.</p>
        <Link href="/tentang-kami">
          <Button variant="outline">Kembali</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 text-slate-300 pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Breadcrumb / Back Button */}
        <Link
          href="/tentang-kami"
          className="inline-flex items-center text-slate-400 hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar Tim
        </Link>

        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-12 gap-0">
            {/* KOLOM KIRI: Foto & Info Singkat */}
            <div className="lg:col-span-4 bg-navy-950 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col items-center text-center">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-slate-800 shadow-xl overflow-hidden mb-8">
                {member.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
                    <User className="w-20 h-20" />
                  </div>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {member.name}
              </h1>
              <p className="text-gold font-medium uppercase tracking-widest text-sm mb-6">
                {member.role}
              </p>

              {/* LinkedIn Button (Only if exists) */}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0077b5] hover:bg-[#006396] text-white rounded-full font-bold transition-all transform hover:scale-105"
                >
                  <Linkedin className="w-5 h-5" />
                  Hubungkan di LinkedIn
                </a>
              )}
            </div>

            {/* KOLOM KANAN: Detail Bio */}
            <div className="lg:col-span-8 p-8 md:p-12">
              <div className="prose prose-invert max-w-none">
                <h3 className="text-xl font-bold text-gold mb-6 flex items-center gap-2">
                  <Award className="w-6 h-6" />
                  Profil Profesional
                </h3>

                {/* Render Bio dengan line break yang rapi */}
                <div className="text-slate-300 leading-loose text-lg whitespace-pre-wrap">
                  {member.bio}
                </div>

                {/* Section tambahan jika ada expertise (Opsional visual) */}
                {member.expertise && member.expertise.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-slate-800">
                    <h4 className="text-white font-bold mb-4">
                      Keahlian Utama
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm border border-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
