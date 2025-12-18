import apiPublic from "./apiPublic";

export const createOrder = (orderData) => {
  return apiPublic.post("/orders", orderData);
};
