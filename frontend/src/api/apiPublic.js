import axios from "axios";

const apiPublic = axios.create({
  baseURL: "http://localhost:3000/api",
});

apiPublic.interceptors.request.use((config) => {
  const token = localStorage.getItem("user_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiPublic;
