import axios from "axios";

const apiPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

apiPrivate.interceptors.request.use((config) => {
  const token = localStorage.getItem("user_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiPrivate;