import api from "@/lib/axios";

export interface Publication {
  id: string;
  title: string;
  slug: string;
  type: string;
  content: string;
  author: string;
  image_url: string;
  published_at: string;
}

export const publicationService = {
  // 1. Get Latest (Untuk Homepage - Tetap)
  getLatest: async () => {
    const response = await api.get("/publications?limit=3&page=1");
    return response.data;
  },

  // 2. Get All with Pagination (BARU - Untuk halaman /publikasi)
  getAll: async (page: number = 1, limit: number = 9) => {
    const response = await api.get(`/publications?page=${page}&limit=${limit}`);
    return response.data;
  },

  // 3. Get Detail (Untuk halaman baca artikel)
  getBySlug: async (slug: string) => {
    const response = await api.get(`/publications/${slug}`);
    return response.data;
  },
};
