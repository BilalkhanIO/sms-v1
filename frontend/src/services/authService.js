import api from '../utils/axios';

// Authentication functions
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.requires2FA) {
      return response.data; // Return early if 2FA is required
    }
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed';
  }
};

export const verifyEmail = async (token) => {
  try {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Email verification failed';
  }
};

// Password management functions
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to send reset email';
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await api.put(`/auth/reset-password/${token}`, { password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to reset password';
  }
};

export const updatePassword = async (passwords) => {
  try {
    const response = await api.put('/users/update-password', passwords);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update password';
  }
};

// 2FA functions
export const enable2FA = async () => {
  try {
    const response = await api.post('/users/enable-2fa');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to enable 2FA';
  }
};

export const disable2FA = async () => {
  try {
    const response = await api.post('/users/disable-2fa');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to disable 2FA';
  }
};

// Device management functions
export const getActiveDevices = async () => {
  try {
    const response = await api.get('/users/active-devices');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch active devices';
  }
};

export const removeDevice = async (deviceId) => {
  try {
    const response = await api.delete(`/users/devices/${deviceId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to remove device';
  }
};

// Profile functions
export const getProfile = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch profile';
  }
};

// Token management functions
export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};

// Optional: Create a default export with all functions
const authService = {
  login,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
  updatePassword,
  enable2FA,
  disable2FA,
  getActiveDevices,
  removeDevice,
  getProfile,
  logout,
  getToken,
  isAuthenticated
};

export default authService;
