import api from "@/lib/axios";
import { setCookie, deleteCookie, getCookie } from "cookies-next";

// Interface untuk response login
interface LoginResponse {
  status: string;
  message: string;
  data: {
    token: string;
    name: string;
    role: string;
  };
}

export const authService = {
  // 1. Fungsi Login
  login: async (email: string, password: string) => {
    const response = await api.post<LoginResponse>("/login", {
      email,
      password,
    });

    // --- PERBAIKAN DISINI ---
    // Masalah Lama: response.data.token (Salah, karena token ada di dalam objek data lagi)
    // Solusi Baru: response.data.data.token

    if (response.data.data && response.data.data.token) {
      // Opsi A: Simpan ke Cookie (Jika Anda pakai library cookies-next)
      // setCookie("token", response.data.data.token, { maxAge: 60 * 60 * 24 });
      // i choose to use localStorage for simplicity in this project. and also to be consistent with the previous code in layout.tsx

      // Opsi B: Simpan ke LocalStorage (Lebih mudah & sesuai tutorial kita sebelumnya)
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.data.data.token);
      }
    }

    return response.data;
  },

  // 2. Fungsi Logout
  logout: () => {
    deleteCookie("token");
    window.location.href = "/admin/login"; // Redirect paksa ke login
  },

  // 3. Cek apakah sedang login (Punya token?)
  isAuthenticated: () => {
    return !!getCookie("token");
  },

  // 4. Ambil Token (untuk Authorization Header nanti)
  getToken: () => {
    return getCookie("token");
  },
};
