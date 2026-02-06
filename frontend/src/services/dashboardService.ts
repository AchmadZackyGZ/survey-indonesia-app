import api from "@/lib/axios";

export interface DashboardStats {
  total_surveys: number;
  total_publications: number;
  total_contacts: number;
}

export const dashboardService = {
  // Mengambil Data Statistik (Count)
  getStats: async () => {
    // Sesuai route backend: protected.GET("/dashboard/stats")
    const response = await api.get("/dashboard/stats");
    return response.data;
  },
};
