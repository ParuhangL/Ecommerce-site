import axios from "axios";

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // Backend API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Fetch token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
