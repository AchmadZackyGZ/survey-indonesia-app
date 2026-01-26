import axios from "axios";

// Ambil URL dari .env atau fallback ke localhost
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Setiap request keluar, otomatis tempel token jika ada
api.interceptors.request.use(
  (config) => {
    // Kita akan pakai localStorage untuk simpan token nanti
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
