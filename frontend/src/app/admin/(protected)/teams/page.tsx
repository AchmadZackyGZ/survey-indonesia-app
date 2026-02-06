"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { teamService, TeamMember } from "@/services/teamService";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  Edit,
  Loader2,
  Users,
  Linkedin,
  AlertCircle,
} from "lucide-react";

export default function TeamsPage() {
  const [teams, setTeams] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await teamService.getAll();
      setTeams(res.data || []);
    } catch (error) {
      console.error("Gagal memuat tim:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 2. Handle Delete
  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus anggota tim ini?")) {
      await teamService.delete(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Tim</h1>
          <p className="text-slate-500 text-sm">
            Kelola daftar dewan pakar dan struktur organisasi.
          </p>
        </div>
        <Link href="/admin/teams/create">
          <Button className="w-full md:w-auto bg-gold hover:bg-gold-light text-slate-950 font-bold shadow-lg shadow-gold/20">
            <Plus className="w-4 h-4 mr-2" /> Tambah Anggota
          </Button>
        </Link>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin w-8 h-8 text-gold" />
        </div>
      ) : (
        <>
          {teams.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">
                Belum ada anggota tim.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Bagian Foto & Info */}
                  <div className="p-6 flex flex-col items-center text-center border-b border-slate-100 flex-1">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 mb-4 border-2 border-slate-100 shadow-sm">
                      {item.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.photo_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Users className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">
                      {item.name}
                    </h3>
                    <p className="text-gold font-medium text-sm mb-2">
                      {item.role}
                    </p>
                    {/* Preview Bio Pendek */}
                    <p className="text-slate-500 text-xs line-clamp-2 mb-3">
                      {item.bio}
                    </p>

                    {/* Icon LinkedIn (Jika Ada) */}
                    {item.linkedin && (
                      <a
                        href={item.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Tombol Aksi */}
                  <div className="flex divide-x divide-slate-100 bg-slate-50">
                    <Link
                      href={`/admin/teams/edit/${item.id}`}
                      className="flex-1"
                    >
                      <Button
                        variant="ghost"
                        className="w-full h-12 rounded-none text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>
                    </Link>
                    <div className="flex-1">
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(item.id)}
                        className="w-full h-12 rounded-none text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Hapus
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
