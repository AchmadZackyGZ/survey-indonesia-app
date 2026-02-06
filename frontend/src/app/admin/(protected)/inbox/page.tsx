"use client";

import { useEffect, useState } from "react";
import { contactService, Contact } from "@/services/contactService";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Loader2,
  Mail,
  AlertCircle,
  Eye,
  X,
  Calendar,
  User,
} from "lucide-react";

export default function InboxPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk Modal Detail Pesan
  const [selectedMessage, setSelectedMessage] = useState<Contact | null>(null);

  // 1. Fetch Data Pesan
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await contactService.getAll();
      setContacts(res.data || []);
    } catch (error) {
      console.error("Gagal memuat pesan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 2. Handle Delete
  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus pesan ini?")) {
      await contactService.deleteById(id);
      loadData(); // Refresh setelah hapus
      setSelectedMessage(null); // Tutup modal jika sedang terbuka
    }
  };

  return (
    <div className="space-y-6 pb-20 relative">
      {/* --- HEADER --- */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pesan Masuk</h1>
        <p className="text-slate-500 text-sm">
          Daftar pertanyaan dan pesan dari pengunjung website.
        </p>
      </div>

      {/* --- CONTENT --- */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin w-8 h-8 text-gold" />
        </div>
      ) : (
        <>
          {contacts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">
                Belum ada pesan masuk.
              </p>
            </div>
          ) : (
            <>
              {/* TABLE VIEW (DESKTOP) */}
              <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-xs font-semibold">
                    <tr>
                      <th className="p-4 w-12 text-center">No</th>
                      <th className="p-4 w-48">Pengirim</th>
                      <th className="p-4 w-48">Subjek</th>
                      <th className="p-4">Isi Pesan</th>
                      <th className="p-4 w-40">Tanggal</th>
                      <th className="p-4 w-24 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {contacts.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50 transition-colors group cursor-pointer"
                        onClick={() => setSelectedMessage(item)} // Klik baris untuk baca
                      >
                        <td className="p-4 text-center text-slate-400">
                          {index + 1}
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-slate-800 block">
                            {item.first_name} {item.last_name}
                          </span>
                          <span className="text-slate-400 text-xs">
                            {item.email}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            {item.subject}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600">
                          <p className="line-clamp-1">{item.message}</p>
                        </td>
                        <td className="p-4 text-slate-500 text-xs">
                          {new Date(item.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation(); // Agar tidak trigger modal
                                handleDelete(item.id);
                              }}
                              className="h-8 w-8 hover:bg-red-50 text-red-600"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CARD VIEW (MOBILE) */}
              <div className="md:hidden grid gap-4">
                {contacts.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedMessage(item)}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 active:scale-95 transition-transform"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          {item.first_name} {item.last_name}
                        </h3>
                        <p className="text-xs text-slate-500">{item.email}</p>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-xs font-bold text-slate-700 mb-1">
                        {item.subject}
                      </p>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {item.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* --- MODAL DETAIL PESAN --- */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Detail Pesan</h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Info Pengirim */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">
                    {selectedMessage.first_name} {selectedMessage.last_name}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {selectedMessage.email}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(selectedMessage.created_at).toLocaleString(
                      "id-ID",
                    )}
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Isi Pesan */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                  Subjek
                </label>
                <p className="text-slate-900 font-medium mb-3">
                  {selectedMessage.subject}
                </p>

                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                  Pesan
                </label>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              {/* Tombol Tutup: Saya tambahkan warna teks eksplisit (text-slate-700) */}
              <Button
                variant="outline"
                onClick={() => setSelectedMessage(null)}
                className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                Tutup
              </Button>

              {/* Tombol Hapus: Saya gunakan variant='ghost' dan paksa warna background & text */}
              <Button
                variant="ghost"
                onClick={() => handleDelete(selectedMessage.id)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Hapus Pesan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
