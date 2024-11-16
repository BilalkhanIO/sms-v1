import api from './api';
import { validateUser, validateUserProfile } from '../utils/validation/userValidation';

class UserService {
  async getUsers(params) {
    try {
      const response = await api.get('/users', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUserById(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createUser(userData) {
    try {
      const errors = validateUser(userData);
      if (Object.keys(errors).length > 0) {
        throw { message: 'Validation failed', errors };
      }

      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateUser(id, userData) {
    try {
      const errors = validateUser(userData);
      if (Object.keys(errors).length > 0) {
        throw { message: 'Validation failed', errors };
      }

      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteUser(id) {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(id, profileData) {
    try {
      const errors = validateUserProfile(profileData);
      if (Object.keys(errors).length > 0) {
        throw { message: 'Validation failed', errors };
      }

      const response = await api.put(`/users/${id}/profile`, profileData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async uploadProfilePicture(id, file) {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await api.post(`/users/${id}/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async changePassword(id, passwordData) {
    try {
      const response = await api.post(`/users/${id}/change-password`, passwordData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resetPassword(email) {
    try {
      const response = await api.post('/users/reset-password', { email });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyEmail(token) {
    try {
      const response = await api.post('/users/verify-email', { token });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      throw {
        message: error.response.data.message || 'An error occurred',
        errors: error.response.data.errors || {},
        status: error.response.status
      };
    }
    throw error;
  }
}

export default new UserService();
