import api from './api';

class DashboardService {
  async getStats(role) {
    try {
      const response = await api.get(`/api/dashboard/stats/${role.toLowerCase()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch dashboard stats';
    }
  }

  async getRecentActivities() {
    try {
      const response = await api.get('/api/dashboard/activities');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch recent activities';
    }
  }

  async getUpcomingClasses() {
    try {
      const response = await api.get('/api/dashboard/upcoming-classes');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch upcoming classes';
    }
  }

  async getPerformanceStats() {
    try {
      const response = await api.get('/api/dashboard/stats/performance');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch performance stats';
    }
  }
  // ... other methods
}

export default new DashboardService();