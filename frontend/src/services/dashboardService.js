import apiService from './apiService';

class DashboardService {
  async getStats(role) {
    try {
      const response = await apiService.getDashboardStats(role);
      return response;
    } catch (error) {
      throw apiService.handleError(error);
    }
  }

  async getRecentActivities() {
    try {
      const response = await apiService.getRecentActivities();
      return response;
    } catch (error) {
      throw apiService.handleError(error);
    }
  }

  async getUpcomingClasses() {
    try {
      const response = await apiService.getUpcomingClasses();
      return response;
    } catch (error) {
      throw apiService.handleError(error);
    }
  }

  async getPerformanceData(params) {
    try {
      const response = await apiService.api.get('/dashboard/performance', { params });
      return response.data;
    } catch (error) {
      throw apiService.handleError(error);
    }
  }

  async getAttendanceStats(params) {
    try {
      const response = await apiService.api.get('/dashboard/attendance-stats', { params });
      return response.data;
    } catch (error) {
      throw apiService.handleError(error);
    }
  }
}

export default new DashboardService(); 