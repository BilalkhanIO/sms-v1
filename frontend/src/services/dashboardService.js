import api from '../utils/axios';

class DashboardService {
  async getStats(role) {
    try {
      const response = await api.get(`/api/dashboard/stats/${role}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getRecentActivities() {
    try {
      const response = await api.get('/api/dashboard/activities');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getUpcomingClasses() {
    try {
      const response = await api.get('/api/dashboard/upcoming-classes');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getAttendanceData(params) {
    try {
      const response = await api.get('/api/dashboard/attendance', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

export default new DashboardService(); 