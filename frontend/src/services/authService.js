import api from '../utils/axios';

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, password) {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updatePassword(passwords) {
    const response = await api.put('/auth/update-password', passwords);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  }
}; 