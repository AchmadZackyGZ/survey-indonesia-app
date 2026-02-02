import api from "@/lib/axios"; // Pastikan path ini sesuai (bisa @/lib/api atau @/lib/axios)

export interface Publication {
  id: string;
  title: string;
  slug: string;
  type?: string; // Opsional: Berita/Artikel/Rilis
  content: string;
  author?: string;
  image_url?: string; // Link gambar utama
  thumbnail?: string; // Link gambar kecil (jika ada)
  published_at?: string;
  created_at: string;
  category: string;
}

export const publicationService = {
  // ==========================================
  // 1. PUBLIC METHODS (Untuk Pengunjung Web)
  // ==========================================

  // Get Latest (Untuk Homepage)
  getLatest: async () => {
    const response = await api.get("/publications?limit=3&page=1");
    return response.data;
  },

  // Get All with Pagination (Untuk halaman /publikasi)
  getAll: async (page: number = 1, limit: number = 9) => {
    // Tambahkan parameter search jika perlu nanti
    const response = await api.get(`/publications?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get Detail by Slug (Untuk halaman baca artikel: /publikasi/judul-artikel)
  getBySlug: async (slug: string) => {
    const response = await api.get(`/publications/${slug}`);
    return response.data;
  },

  // ==========================================
  // 2. ADMIN METHODS (CRUD - Wajib Ada!)
  // ==========================================

  // Get By ID (PENTING: Untuk Admin Edit Page, ambil berdasarkan ID bukan Slug)
  getById: async (id: string) => {
    // Sesuaikan endpoint backend Anda, biasanya /publications/id/:id atau /publications/:id
    const response = await api.get(`/publications/id/${id}`);
    return response.data;
  },

  // Create (Buat Artikel Baru)
  create: async (data: Partial<Publication> | FormData) => {
    // Gunakan FormData jika ada upload file langsung, atau JSON jika image berupa string URL
    const response = await api.post("/publications", data);
    return response.data;
  },

  // Update (Edit Artikel)
  update: async (id: string, data: Partial<Publication> | FormData) => {
    const response = await api.put(`/publications/${id}`, data);
    return response.data;
  },

  // Delete (Hapus Artikel)
  delete: async (id: string) => {
    const response = await api.delete(`/publications/${id}`);
    return response.data;
  },
};
