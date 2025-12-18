import axios from "axios";

const BASE =
  (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/$/, "");

const apiAdmin = axios.create({
  baseURL: `${BASE}/admin`,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   REQUEST: token + fix rutas
========================= */
apiAdmin.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("user_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Si sin querer llamas "/admin/..." evita "/admin/admin/..."
    if (typeof config.url === "string") {
      config.url = config.url.replace(/^\/admin\/?/i, "/");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE: log de errores
========================= */
apiAdmin.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;

    console.log("❌ API ADMIN ERROR:", {
      url: error?.config?.baseURL + (error?.config?.url || ""),
      method: error?.config?.method,
      status,
      data,
    });

    // Si expiró o no hay token
    if (status === 401) {
      // opcional: limpiar y mandar login
      // localStorage.removeItem("user_token");
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default apiAdmin;
