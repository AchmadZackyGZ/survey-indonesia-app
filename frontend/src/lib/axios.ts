import axios from "axios";

// Buat instance Axios
const api = axios.create({
  // Jika sedang di Vercel, pakai URL environment.
  // Jika di laptop (dev), pakai localhost.
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// =================================================================
// 1. REQUEST INTERCEPTOR (Penyisip Token)
// =================================================================
// Setiap kali mau request (GET/POST/PUT/DELETE), fungsi ini jalan duluan.
api.interceptors.request.use(
  (config) => {
    // Cek apakah kita ada di browser (bukan server side)
    if (typeof window !== "undefined") {
      // Ambil token dari brankas LocalStorage
      const token = localStorage.getItem("token");

      if (token) {
        // SISIPKAN TOKEN KE HEADER!
        // Backend Go akan mengecek header "Authorization" ini
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// =================================================================
// 2. RESPONSE INTERCEPTOR (Penanganan Error Otomatis)
// =================================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika Backend membalas "401 Unauthorized" (Token Basi/Palsu)
    if (error.response && error.response.status === 401) {
      console.error("Sesi habis atau token tidak valid. Logout otomatis...");

      if (typeof window !== "undefined") {
        // Hapus token sampah
        localStorage.removeItem("token");
        localStorage.removeItem("adminName");

        // Tendang balik ke halaman login (opsional, tapi disarankan)
        // window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
