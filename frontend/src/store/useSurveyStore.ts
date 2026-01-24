import { create } from "zustand";
import axios from "axios";

// Definisikan tipe data sesuai dengan Backend Go
interface Survey {
  id: string;
  title: string;
  category: string;
  chart_data: Record<string, unknown>;
  published_at: string;
}

interface SurveyState {
  surveys: Survey[];
  isLoading: boolean;
  error: string | null;
  fetchSurveys: () => Promise<void>;
  filterByCategory: (category: string) => void;
}

export const useSurveyStore = create<SurveyState>((set) => ({
  surveys: [],
  isLoading: false,
  error: null,

  // Action: Ambil data dari Backend Go
  fetchSurveys: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get("http://localhost:8080/surveys");
      // Asumsi response backend: { data: [...] }
      set({ surveys: response.data.data, isLoading: false });
    } catch (err) {
      console.error(err);
      set({ error: "Gagal mengambil data survei", isLoading: false });
    }
  },

  filterByCategory: (category) => {
    // Logic filter client-side sederhana
    // (Idealnya filter dilakukan di backend query jika data banyak)
    console.log("Filtering by", category);
  },
}));
