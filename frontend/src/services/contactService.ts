import api from "@/lib/axios";

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export const contactService = {
  // GET ALL MESSAGES(admin only saja)
  getAll: async () => {
    const response = await api.get("/contacts");
    return response.data;
  },

  //delete message by id (admin only)
  deleteById: async (id: string) => {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
  },
};
