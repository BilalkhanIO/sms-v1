import api from './api';
import { validateExam, validateExamSchedule, validateExamResults } from '../utils/validation/examValidation';

class ExamService {
  async getExams(params) {
    try {
      const response = await api.get('/exams', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getExamById(id) {
    try {
      const response = await api.get(`/exams/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createExam(examData) {
    try {
      const errors = validateExam(examData);
      if (Object.keys(errors).length > 0) {
        throw { message: 'Validation failed', errors };
      }

      const response = await api.post('/exams', examData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateExam(id, examData) {
    try {
      const errors = validateExam(examData);
      if (Object.keys(errors).length > 0) {
        throw { message: 'Validation failed', errors };
      }

      const response = await api.put(`/exams/${id}`, examData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteExam(id) {
    try {
      const response = await api.delete(`/exams/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async scheduleExam(examId, scheduleData) {
    try {
      const errors = validateExamSchedule(scheduleData);
      if (Object.keys(errors).length > 0) {
        throw { message: 'Validation failed', errors };
      }

      const response = await api.post(`/exams/${examId}/schedule`, scheduleData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async submitResults(examId, resultsData) {
    try {
      const errors = validateExamResults(resultsData);
      if (Object.keys(errors).length > 0) {
        throw { message: 'Validation failed', errors };
      }

      const response = await api.post(`/exams/${examId}/results`, resultsData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getExamResults(examId, params) {
    try {
      const response = await api.get(`/exams/${examId}/results`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getStudentExamResults(studentId, params) {
    try {
      const response = await api.get(`/students/${studentId}/exam-results`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async generateExamReports(examId, reportType) {
    try {
      const response = await api.get(`/exams/${examId}/reports/${reportType}`);
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

export default new ExamService();
