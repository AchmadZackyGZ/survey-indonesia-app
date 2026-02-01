import api from "@/lib/axios";

// 1. Buat Interface Khusus untuk Struktur Grafik (Supaya Rapi)
export interface ChartData {
  labels: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

// 2. SurveyInput: Data yang kita KIRIM ke Backend (Create)
export interface SurveyInput {
  title: string;
  category: string;
  description: string;
  cover_image?: string; // Optional
  methodology: string;
  respondents: string;
  margin_error: string;
  region: string;
  chart_data: ChartData; // Re-use interface ChartData
}

// 3. Survey: Data yang kita TERIMA dari Backend (Read)
export interface Survey {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  published_at: string;
  methodology: string;
  respondents: string;
  margin_error: string;
  region: string;
  chart_data: ChartData; // Re-use interface ChartData
  cover_image?: string; // Gunakan '?' (Optional) karena form create kita belum ada upload gambar
}

export const surveyService = {
  create: async (data: SurveyInput) => {
    const response = await api.post("/surveys", data);
    return response.data;
  },

  // ... fungsi lainnya
  getLatest: async () => {
    const response = await api.get("/surveys?limit=3&page=1");
    return response.data;
  },

  getAll: async (page: number = 1, limit: number = 100) => {
    const response = await api.get(`/surveys?page=${page}&limit=${limit}`);
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get(`/surveys/${slug}`);
    return response.data;
  },

  deleteSurvey: async (id: string) => {
    const response = await api.delete(`/surveys/${id}`);
    return response.data;
  },

  // 1. Ambil data berdasarkan ID (bukan slug) untuk form edit
  getById: async (id: string) => {
    const response = await api.get(`/surveys/id/${id}`);
    return response.data;
  },

  // 2. Kirim data update
  update: async (id: string, data: SurveyInput) => {
    const response = await api.put(`/surveys/${id}`, data);
    return response.data;
  },
};
