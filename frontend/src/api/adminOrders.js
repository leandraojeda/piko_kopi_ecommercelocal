import apiAdmin from "./apiAdmin";

export const getOrders = () => apiAdmin.get("/admin/orders");
