import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:6001/api",
  withCredentials: true,
});

// Add request interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Interceptor - Token:", token); // Add this line
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
