import axios from 'axios';
import store  from '../redux/store';
import { logout } from '../redux/features/authSlice';

const BASE_URL = import.meta.env.VITE_API_URL;

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
              throw new Error('No refresh token');
            }

            const response = await this.refreshToken(refreshToken);
            const { token } = response.data;

            localStorage.setItem('token', token);
            originalRequest.headers.Authorization = `Bearer ${token}`;

            return this.api(originalRequest);
          } catch (refreshError) {
            store.dispatch(logout());
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials) {
    const response = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData) {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async refreshToken(refreshToken) {
    const response = await this.api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  }

  async logout() {
    const response = await this.api.post('/auth/logout');
    return response.data;
  }

  // Dashboard endpoints
  async getDashboardStats(role) {
    const response = await this.api.get(`/dashboard/stats/${role}`);
    return response.data;
  }

  async getRecentActivities() {
    const response = await this.api.get('/dashboard/activities');
    return response.data;
  }

  async getUpcomingClasses() {
    const response = await this.api.get('/dashboard/upcoming-classes');
    return response.data;
  }

  // User management endpoints
  async getUsers(params) {
    const response = await this.api.get('/users', { params });
    return response.data;
  }

  async createUser(userData) {
    const response = await this.api.post('/users', userData);
    return response.data;
  }

  async updateUser(userId, userData) {
    const response = await this.api.put(`/users/${userId}`, userData);
    return response.data;
  }

  async deleteUser(userId) {
    const response = await this.api.delete(`/users/${userId}`);
    return response.data;
  }

  // Profile endpoints
  async getUserProfile() {
    const response = await this.api.get('/users/profile');
    return response.data;
  }

  async updateUserProfile(profileData) {
    const response = await this.api.put('/users/profile', profileData);
    return response.data;
  }

  async uploadProfilePicture(file) {
    const formData = new FormData();
    formData.append('profilePicture', file);
    const response = await this.api.post('/users/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
}

export default new ApiService();
