import api from "@/lib/axios";
import { Survey } from "@/types/survey";

export const getSurveys = async () => {
  const response = await api.get("/surveys");
  return response.data;
};
