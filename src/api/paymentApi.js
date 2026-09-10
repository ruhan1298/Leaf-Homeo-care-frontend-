import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach token automatically to every request made with this instance
API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

export const createPaymentOrder = async (appointmentId, couponId = null) => {
  const response = await API.post("/api/v1/payment/payment", {
    appointmentId,
    couponId,
  });
  return response.data;
};
