import api from "@/lib/axios";

export interface Publication {
  id: string;
  title: string;
  slug: string;
  type: string; // "Berita", "Opini", "Rilis Pers"
  content: string; // HTML string
  author: string;
  image_url: string;
  published_at: string;
}

export const publicationService = {
  // Ambil publikasi terbaru (Limit 3 untuk homepage)
  getLatest: async () => {
    const response = await api.get("/publications?limit=3&page=1");
    return response.data;
  },

  // Ambil detail publikasi by slug
  getBySlug: async (slug: string) => {
    const response = await api.get(`/publications/${slug}`);
    return response.data;
  },
};
