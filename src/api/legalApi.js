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

// Privacy Policy APIs (Admin)
export const createPrivacyPolicy = async (data) => {
  const response = await API.post("/api/v1/admin/privacy-policy/create", data);
  return response.data;
};

export const getPrivacyPolicy = async () => {
  const response = await API.get("/api/v1/patient/privacy-policy");
  return response.data;
};

export const updatePrivacyPolicy = async (data) => {
  const response = await API.put("/api/v1/admin/privacy-policy/update", data);
  return response.data;
};

// Terms & Conditions APIs (Admin)
export const createTermsConditions = async (data) => {
  const response = await API.post("/api/v1/admin/terms-conditions/create", data);
  return response.data;
};

export const getTermsConditions = async () => {
  const response = await API.get("/api/v1/patient/terms-conditions");
  return response.data;
};

export const updateTermsConditions = async (data) => {
  const response = await API.put("/api/v1/admin/terms-conditions/update", data);
  return response.data;
};
