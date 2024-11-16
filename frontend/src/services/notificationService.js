import apiService from './apiService';

class NotificationService {
  async getNotifications(params) {
    try {
      const response = await apiService.api.get('/notifications', { params });
      return response.data;
    } catch (error) {
      throw apiService.handleError(error);
    }
  }

  async markAsRead(notificationId) {
    try {
      const response = await apiService.api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw apiService.handleError(error);
    }
  }

  async markAllAsRead() {
    try {
      const response = await apiService.api.put('/notifications/read-all');
      return response.data;
    } catch (error) {
      throw apiService.handleError(error);
    }
  }
}

export default new NotificationService();
