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

export const getDoctors = async (page, limit, search) => {
  const response = await API.post("/api/v1/admin/getdoctors", {
    page,
    limit,
    search,
  });

  return response.data;
};

export const addDoctor = async (doctorData) => {
  const payload = {
    ...doctorData,
    IsExpert: doctorData.isExpert ?? doctorData.IsExpert ?? false,
  };
  delete payload.isExpert;
  const response = await API.post("/api/v1/admin/add", payload);
  return response.data;
};

export const deleteDoctor = async (doctorId) => {
  const response = await API.post("/api/v1/admin/delete", { doctorId });
  return response.data;
};

export const updateDoctor = async (doctorData) => {
  const payload = {
    ...doctorData,
    IsExpert: doctorData.isExpert ?? doctorData.IsExpert ?? false,
  };
  delete payload.isExpert;
  
  let response;
  if (doctorData.image instanceof File) {
    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key]);
    });
    response = await API.post("/api/v1/admin/updatedoctor", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } else {
    response = await API.post("/api/v1/admin/updatedoctor", payload);
  }
  return response.data;
};