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

export const getBlogs = async () => {
  const response = await API.get("/api/v1/blog/get-blogs");
  return response.data;
};

export const createBlog = async (blogData) => {
  console.log('Creating blog with data:', blogData);
  
  // Always use FormData for consistency with multer
  const formData = new FormData();
  formData.append('title', String(blogData.title || ''));
  formData.append('description', String(blogData.description || ''));
  formData.append('type', String(blogData.type || 'Patient'));
  
  // Add image file if it exists
  if (blogData.Image instanceof File) {
    console.log('Adding image file:', blogData.Image.name);
    formData.append('Image', blogData.Image);
  } else {
    console.log('No image file provided');
  }
  
  console.log('Sending FormData');
  const response = await API.post("/api/v1/admin/add-blog", formData);
  return response.data;
};

export const updateBlog = async (blogData) => {
  const formData = new FormData();
  
  console.log('Updating blog with data:', blogData);
  
  // Handle text fields
  if (blogData.id) formData.append('id', String(blogData.id));
  if (blogData.title) formData.append('title', String(blogData.title));
  if (blogData.description) formData.append('description', String(blogData.description));
  if (blogData.type) formData.append('type', String(blogData.type));
  
  // Handle image file only if it exists
  if (blogData.Image instanceof File) {
    console.log('Adding image file:', blogData.Image.name);
    formData.append('Image', blogData.Image);
  } else {
    console.log('No image file provided for update');
  }
  
  // Don't set Content-Type header - let axios set it automatically with boundary
  const response = await API.post("/api/v1/admin/update-blog", formData);
  return response.data;
};

export const deleteBlog = async (blogId) => {
  const response = await API.post("/api/v1/admin/delete-blog", { id: blogId });
  return response.data;
};