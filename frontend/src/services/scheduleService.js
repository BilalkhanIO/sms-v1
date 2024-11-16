import api from './api';
import { validateSchedule, validatePeriod } from '../utils/validation/scheduleValidation';

class ScheduleService {
  async getSchedules(params) {
    try {
      const response = await api.get('/schedules', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getScheduleById(id) {
    try {
      const response = await api.get(`/schedules/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createSchedule(scheduleData) {
    try {
      const errors = validateSchedule(scheduleData);
      if (Object.keys(errors).length > 0) {
        throw { message: 'Validation failed', errors };
      }

      const response = await api.post('/schedules', scheduleData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateSchedule(id, scheduleData) {
    try {
      const errors = validateSchedule(scheduleData);
      if (Object.keys(errors).length > 0) {
        throw { message: 'Validation failed', errors };
      }

      const response = await api.put(`/schedules/${id}`, scheduleData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteSchedule(id) {
    try {
      const response = await api.delete(`/schedules/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addPeriod(scheduleId, periodData) {
    try {
      const errors = validatePeriod(periodData);
      if (Object.keys(errors).length > 0) {
        throw { message: 'Validation failed', errors };
      }

      const response = await api.post(`/schedules/${scheduleId}/periods`, periodData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updatePeriod(scheduleId, periodId, periodData) {
    try {
      const errors = validatePeriod(periodData);
      if (Object.keys(errors).length > 0) {
        throw { message: 'Validation failed', errors };
      }

      const response = await api.put(
        `/schedules/${scheduleId}/periods/${periodId}`,
        periodData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deletePeriod(scheduleId, periodId) {
    try {
      const response = await api.delete(
        `/schedules/${scheduleId}/periods/${periodId}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTeacherSchedule(teacherId, params) {
    try {
      const response = await api.get(`/schedules/teacher/${teacherId}`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getClassSchedule(classId, params) {
    try {
      const response = await api.get(`/schedules/class/${classId}`, { params });
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

export default new ScheduleService();
