import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // Pastikan baris-baris ini ada agar Tailwind membaca file di dalam src
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}", // Jika Anda pakai folder sections
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#f59e0b", // Amber 500
          light: "#fbbf24", // Amber 400
          dark: "#b45309", // Amber 700
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
