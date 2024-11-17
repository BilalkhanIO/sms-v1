import api from './api';

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';

const setTokens = (token, refreshToken) => {
  localStorage.setItem(TOKEN_KEY, token);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { token, refreshToken, user, requires2FA } = response.data;

    if (requires2FA) {
      return { requires2FA: true, userId: user._id };
    }

    if (token) {
      setTokens(token, refreshToken);
    }

    return { user, token };
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearTokens();
  }
};

export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) throw new Error('No refresh token');

    const response = await api.post('/auth/refresh-token', { refreshToken });
    const { token } = response.data;
    
    localStorage.setItem(TOKEN_KEY, token);
    return token;
  } catch (error) {
    clearTokens();
    throw error;
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
    if (error.response?.data) {
      throw error.response.data;
    }
    throw new Error('Registration failed. Please try again.');
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
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
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
  isAuthenticated,
  refreshAccessToken
};

export default authService;
