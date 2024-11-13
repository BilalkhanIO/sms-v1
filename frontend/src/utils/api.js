import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://effective-cod-9jx56r7jjvjcprx-6000.app.github.dev/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Access-Control-Allow-Origin'] = 'https://effective-cod-9jx56r7jjvjcprx-5173.app.github.dev';
  return config;
}, error => {
  return Promise.reject(error);
});

export default api; 