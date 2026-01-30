"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authService } from "@/services/authService";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Mail,
  Users,
  LogOut,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Data Survei", href: "/admin/surveys", icon: BarChart3 },
    { name: "Publikasi", href: "/admin/publications", icon: FileText },
    { name: "Pesan Masuk", href: "/admin/inbox", icon: Mail },
    { name: "Tim & User", href: "/admin/users", icon: Users },
  ];

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-800 bg-slate-950 text-slate-300 transition-transform">
      {/* 1. Logo Area */}
      <div className="flex h-16 items-center border-b border-slate-800 px-6">
        <span className="font-serif text-xl font-bold text-white tracking-wide">
          LSI{" "}
          <span className="text-gold text-sm font-sans uppercase">Admin</span>
        </span>
      </div>

      {/* 2. Menu Navigasi */}
      <div className="flex flex-col justify-between h-[calc(100vh-64px)] p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                isActive(item.href)
                  ? "bg-gold text-slate-950 font-bold shadow-lg shadow-gold/20"
                  : "hover:bg-slate-900 hover:text-white"
              }`}
            >
              <item.icon
                className={`h-5 w-5 ${isActive(item.href) ? "text-slate-950" : "text-gold"}`}
              />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* 3. Tombol Logout (Di Bawah) */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={() => authService.logout()}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
