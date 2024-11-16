import api from './api';

class StudentService {
  // Fetch all students with pagination and filters
  async getStudents(params) {
    try {
      const response = await api.get('/students', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Fetch single student by ID
  async getStudentById(id) {
    try {
      const response = await api.get(`/students/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create new student
  async createStudent(studentData) {
    try {
      const formData = new FormData();
      
      // Handle file uploads and form data
      Object.keys(studentData).forEach(key => {
        if (key === 'documents') {
          Object.keys(studentData.documents).forEach(docKey => {
            if (studentData.documents[docKey]) {
              formData.append(docKey, studentData.documents[docKey]);
            }
          });
        } else if (typeof studentData[key] === 'object') {
          formData.append(key, JSON.stringify(studentData[key]));
        } else {
          formData.append(key, studentData[key]);
        }
      });

      const response = await api.post('/students', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update student
  async updateStudent(id, studentData) {
    try {
      const formData = new FormData();
      
      Object.keys(studentData).forEach(key => {
        if (key === 'documents') {
          Object.keys(studentData.documents).forEach(docKey => {
            if (studentData.documents[docKey]) {
              formData.append(docKey, studentData.documents[docKey]);
            }
          });
        } else if (typeof studentData[key] === 'object') {
          formData.append(key, JSON.stringify(studentData[key]));
        } else {
          formData.append(key, studentData[key]);
        }
      });

      const response = await api.put(`/students/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete student
  async deleteStudent(id) {
    try {
      const response = await api.delete(`/students/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get student attendance
  async getStudentAttendance(studentId, params) {
    try {
      const response = await api.get(`/students/${studentId}/attendance`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get student performance
  async getStudentPerformance(studentId, params) {
    try {
      const response = await api.get(`/students/${studentId}/performance`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get student documents
  async getStudentDocuments(studentId) {
    try {
      const response = await api.get(`/students/${studentId}/documents`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Upload student document
  async uploadDocument(studentId, documentType, file) {
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('type', documentType);

      const response = await api.post(`/students/${studentId}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
}

export default new StudentService(); 