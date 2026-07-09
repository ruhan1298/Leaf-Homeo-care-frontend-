
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

export const getPatients = async (page, limit, search) => {
  const response = await API.post("/api/v1/admin/getpatients", {
    page,
    limit,
    search,
  });

  return response.data;
};

export const getPatientProfile = async (patientId) => {
  const response = await API.post("/api/v1/patient/get-patient-profile", { patientId });
  return response.data;
};

export const updatePatient = async (patientData) => {
  const response = await API.post("/api/v1/admin/updatepatient", patientData);
  return response.data;
};

export const deletePatient = async (patientId) => {
  const response = await API.post("/api/v1/admin/deletepatient", { patientId });
  return response.data;
};