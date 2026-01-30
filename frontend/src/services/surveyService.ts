import api from "@/lib/axios";

// Definisi Tipe Data (Sesuai dengan JSON dari Go Backend)
export interface ChartData {
  type: string;
  labels: string[];
  series: number[];
}

export interface Survey {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  chart_data: ChartData;
  cover_image: string;
  published_at: string;
}

export const surveyService = {
  // Ambil survei terbaru (kita limit 3 saja untuk homepage)
  getLatest: async () => {
    const response = await api.get("/surveys?limit=3&page=1");
    return response.data; // Mengembalikan object { status, data: [], meta }
  },

  // Ambil semua survei dengan pagination
  getAll: async (page: number = 1, limit: number = 6) => {
    // Kita kirim parameter page & limit ke backend Go
    const response = await api.get(`/surveys?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Ambil detail survei by slug
  getBySlug: async (slug: string) => {
    const response = await api.get(`/surveys/${slug}`);
    return response.data;
  },
};
