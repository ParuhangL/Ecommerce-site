import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/orders/";

export const createOrder = async (orderData) => {
  return axios.post(`${API_URL}create/`, orderData);
};

export const getOrders = async () => {
  return axios.get(API_URL);
};

export const updateOrderStatus = async (orderId, status) => {
  return axios.patch(`${API_URL}${orderId}/update/`, { status });
};

export const trackOrder = async (trackingCode) => {
  return axios.get(`${API_URL}track/${trackingCode}/`);
};