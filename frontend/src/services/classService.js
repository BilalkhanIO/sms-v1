import api from './api';
import { validateClassData, validateSubjectAssignment, validateStudentAssignment } from '../utils/validation/classValidation';

class ClassService {
  async getClasses(params) {
    try {
      const response = await api.get('/classes', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getClassById(id) {
    try {
      const response = await api.get(`/classes/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createClass(classData) {
    try {
      const errors = validateClassData(classData);
      if (Object.keys(errors).length > 0) {
        throw { message: 'Validation failed', errors };
      }

      const response = await api.post('/classes', classData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateClass(id, classData) {
    try {
      const errors = validateClassData(classData);
      if (Object.keys(errors).length > 0) {
        throw { message: 'Validation failed', errors };
      }

      const response = await api.put(`/classes/${id}`, classData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteClass(id) {
    try {
      const response = await api.delete(`/classes/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addStudent(classId, studentId) {
    try {
      const classData = await this.getClassById(classId);
      const errors = validateStudentAssignment(studentId, classData);
      if (Object.keys(errors).length > 0) {
        throw { message: 'Validation failed', errors };
      }

      const response = await api.post(`/classes/${classId}/students`, { studentId });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async removeStudent(classId, studentId) {
    try {
      const response = await api.delete(`/classes/${classId}/students/${studentId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addSubject(classId, subjectData) {
    try {
      const classData = await this.getClassById(classId);
      const errors = validateSubjectAssignment(subjectData, classData.subjects);
      if (Object.keys(errors).length > 0) {
        throw { message: 'Validation failed', errors };
      }

      const response = await api.post(`/classes/${classId}/subjects`, subjectData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateSchedule(classId, scheduleData) {
    try {
      const response = await api.put(`/classes/${classId}/schedule`, scheduleData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getClassAnalytics(classId, params) {
    try {
      const response = await api.get(`/classes/${classId}/analytics`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getClassAttendance(classId, date) {
    try {
      const response = await api.get(`/classes/${classId}/attendance`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async markClassAttendance(classId, date, attendanceData) {
    try {
      const response = await api.post(`/classes/${classId}/attendance`, {
        date,
        attendance: attendanceData
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async generateClassReport(classId, type = 'general') {
    try {
      const response = await api.get(`/classes/${classId}/reports/${type}`);
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

export default new ClassService();
