import api from './api';

class AttendanceService {
  async getAttendanceStats(params) {
    try {
      const response = await api.get('/attendance/stats', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async markAttendance(classId, date, attendanceData) {
    try {
      const response = await api.post('/attendance/mark', {
        classId,
        date,
        attendanceData,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAttendanceReport(params) {
    try {
      const response = await api.get('/attendance/report', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getStudentAttendance(studentId, params) {
    try {
      const response = await api.get(`/attendance/student/${studentId}`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateAttendance(attendanceId, data) {
    try {
      const response = await api.put(`/attendance/${attendanceId}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
}

export default new AttendanceService();
