import api from "@/lib/axios";

// 1. Interface Data (Read) - Sesuai dengan respons Backend
export interface Publication {
  id: string;
  title: string;
  slug: string;
  category: string; // Backend pakai 'category'
  content: string;
  author?: string;
  thumbnail?: string; // Konsisten pakai 'thumbnail'
  published_at?: string;
  created_at: string;
  // image_url & type DIHAPUS karena tidak ada di Backend
}

// 2. Interface Input (Create/Update)
export interface PublicationInput {
  title: string;
  category: string;
  content: string;
  thumbnail?: string;
  author: string;
  published_at?: string;
}

export const publicationService = {
  // ==========================================
  // 1. PUBLIC METHODS
  // ==========================================

  getLatest: async () => {
    const response = await api.get("/publications?limit=3&page=1");
    return response.data;
  },

  // ✅ SUDAH BENAR: Mengirim parameter search ke backend
  getAll: async (page: number = 1, limit: number = 9, search: string = "") => {
    const response = await api.get(
      `/publications?page=${page}&limit=${limit}&search=${search}`,
    );
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get(`/publications/${slug}`);
    return response.data;
  },

  // ==========================================
  // 2. ADMIN METHODS
  // ==========================================

  getById: async (id: string) => {
    const response = await api.get(`/publications/id/${id}`);
    return response.data;
  },

  // Gunakan 'PublicationInput' agar Type Safety lebih terjamin
  create: async (data: PublicationInput | FormData) => {
    const response = await api.post("/publications", data);
    return response.data;
  },

  update: async (id: string, data: PublicationInput | FormData) => {
    const response = await api.put(`/publications/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/publications/${id}`);
    return response.data;
  },
};
