import axios from "axios";

console.log("Mera Backend URL hai:", import.meta.env.VITE_API_URL);

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

export const register = async (data) => {
  const response = await API.post("/api/v1/auth/register", data);
  return response.data;
};

export const login = async (data) => {
  const response = await API.post("/api/v1/auth/login", data);
  return response.data;
};

export const adminLogin = async (data) => {
  const response = await API.post("/api/v1/auth/login", data);
  return response.data;
};

export const getUser = async () => {
  const response = await API.get("/api/v1/auth/get-user");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await API.post("/api/v1/auth/update-profile", data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const changePassword = async (data) => {
  const response = await API.post("/api/v1/auth/change-password", data);
  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await API.post("/api/v1/auth/forgot-password", data);
  return response.data;
};

export const verifyOTP = async (data) => {
  const response = await API.post("/api/v1/auth/verify-otp", data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await API.post("/api/v1/auth/reset-password", data);
  return response.data;
};

export const deleteUser = async () => {
  const response = await API.get("/api/v1/auth/delete-user");
  return response.data;
};

export const getNotifications = async () => {
  const response = await API.get("/api/v1/auth/get-notifications");
  return response.data;
};