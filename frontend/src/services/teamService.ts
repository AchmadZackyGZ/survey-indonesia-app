import api from "@/lib/axios";

// Interface sesuai Backend
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo_url: string; // String Base64 dari gambar
  linkedin?: string; // Optional (Boleh kosong)
  expertise?: string[]; // Array keahlian
  created_at?: string;
}

// Interface untuk Input Form
export interface TeamInput {
  name: string;
  role: string;
  bio: string;
  photo_url: string;
  linkedin?: string;
  expertise?: string[];
}

export const teamService = {
  // AMBIL SEMUA (Public/Admin)
  getAll: async () => {
    const response = await api.get("/teams");
    return response.data;
  },

  // AMBIL SATU (Detail/Edit)
  getById: async (id: string) => {
    // Sesuai route backend public GET /teams/:id
    const response = await api.get(`/teams/${id}`);
    return response.data;
  },

  // CREATE (Admin)
  create: async (data: TeamInput) => {
    const response = await api.post("/teams", data);
    return response.data;
  },

  // UPDATE (Admin)
  update: async (id: string, data: TeamInput) => {
    const response = await api.put(`/teams/${id}`, data);
    return response.data;
  },

  // DELETE (Admin)
  delete: async (id: string) => {
    const response = await api.delete(`/teams/${id}`);
    return response.data;
  },
};
