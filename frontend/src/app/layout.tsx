// LOKASI: src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: {
    default: "LSI - Lembaga Survei Indonesia",
    template: "%s | LSI", // Nanti judul halaman jadi: "Judul Berita | LSI"
  },
  description: "Lembaga riset independen pengungkap aspirasi publik Indonesia.",
  icons: {
    icon: "/favicon.ico", // Pastikan Anda punya favicon
  },
  openGraph: {
    title: "LSI - Lembaga Survei Indonesia",
    description: "Barometer opini publik terpercaya di Indonesia.",
    type: "website",
    locale: "id_ID",
    siteName: "Lembaga Survei Indonesia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${inter.variable} ${merriweather.variable} bg-slate-950 text-slate-50 antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
