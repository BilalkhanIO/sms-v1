import api from './api';
import { validateSubjectData } from '../utils/validation/subjectValidation';

class SubjectService {
  async getSubjects(params) {
    try {
      const response = await api.get('/subjects', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSubjectById(id) {
    try {
      const response = await api.get(`/subjects/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createSubject(subjectData) {
    try {
      const errors = validateSubjectData(subjectData);
      if (Object.keys(errors).length > 0) {
        throw { message: 'Validation failed', errors };
      }

      const response = await api.post('/subjects', subjectData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateSubject(id, subjectData) {
    try {
      const errors = validateSubjectData(subjectData);
      if (Object.keys(errors).length > 0) {
        throw { message: 'Validation failed', errors };
      }

      const response = await api.put(`/subjects/${id}`, subjectData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteSubject(id) {
    try {
      const response = await api.delete(`/subjects/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async uploadMaterial(subjectId, materialData) {
    try {
      const formData = new FormData();
      Object.keys(materialData).forEach(key => {
        formData.append(key, materialData[key]);
      });

      const response = await api.post(
        `/subjects/${subjectId}/materials`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSubjectMaterials(subjectId) {
    try {
      const response = await api.get(`/subjects/${subjectId}/materials`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSubjectPerformance(subjectId, params) {
    try {
      const response = await api.get(`/subjects/${subjectId}/performance`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async assignTeacher(subjectId, teacherId) {
    try {
      const response = await api.post(`/subjects/${subjectId}/teacher`, { teacherId });
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

export default new SubjectService();
