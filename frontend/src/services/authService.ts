import api from "@/lib/axios";
import { setCookie, deleteCookie, getCookie } from "cookies-next";

// Interface untuk response login
interface LoginResponse {
  status: string;
  token: string;
}

export const authService = {
  // 1. Fungsi Login
  login: async (email: string, password: string) => {
    const response = await api.post<LoginResponse>("/login", {
      email,
      password,
    });

    // Jika sukses, simpan token ke Cookie (biar aman & persist)
    if (response.data.token) {
      setCookie("token", response.data.token, { maxAge: 60 * 60 * 24 }); // Expire 1 hari
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
