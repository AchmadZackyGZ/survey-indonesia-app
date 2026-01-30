import Sidebar from "@/components/admin/Sidebar";
import { User } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* 1. Sidebar (Fixed di Kiri) */}
      <Sidebar />

      {/* 2. Main Content Wrapper (Disebelah Kanan Sidebar) */}
      <div className="ml-64">
        {/* Header Admin */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8 shadow-sm">
          <h2 className="font-bold text-slate-800">Panel Kontrol</h2>

          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-900">Super Admin</p>
              <p className="text-xs text-slate-500">superadmin@lsi.or.id</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-gold border-2 border-gold">
              <User className="h-5 w-5" />
            </div>
          </div>
        </header>

        {/* Content Halaman (Dashboard, Survey, dll muncul disini) */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
