import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000", 
});
// Attach token automatically to every request made with this instance
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

export const getAppointments = async (page, limit, search) => {
  const response = await API.post("/api/v1/admin/Appointments", {
    page,
    limit,
    search,
  });

  return response.data;
};