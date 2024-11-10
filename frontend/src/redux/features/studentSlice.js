import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Add createStudent action
export const createStudent = createAsyncThunk(
  'student/create',
  async (data) => {
    const response = await axios.post(`${API_URL}/students`, data);
    return response.data;
  }
);

// Add updateStudent action
export const updateStudent = createAsyncThunk(
  'student/update',
  async ({ id, data }) => {
    const response = await axios.put(`${API_URL}/students/${id}`, data);
    return response.data;
  }
);

// Add fetchStudents action
export const fetchStudents = createAsyncThunk(
  'student/fetchAll',
  async (filters = {}) => {
    const response = await axios.get(`${API_URL}/students`, { params: filters });
    return response.data;
  }
);

// Previous actions
export const deleteStudent = createAsyncThunk(
  'student/delete',
  async (id) => {
    await axios.delete(`${API_URL}/students/${id}`);
    return id;
  }
);

export const markAttendance = createAsyncThunk(
  'student/markAttendance',
  async ({ studentId, data }) => {
    const response = await axios.post(`${API_URL}/students/${studentId}/attendance`, data);
    return response.data;
  }
);

export const getAttendanceReport = createAsyncThunk(
  'student/getAttendanceReport',
  async ({ studentId, startDate, endDate }) => {
    const response = await axios.get(
      `${API_URL}/students/${studentId}/attendance-report`,
      { params: { startDate, endDate } }
    );
    return response.data;
  }
);

export const getStudentById = createAsyncThunk(
  'student/getById',
  async (id) => {
    const response = await axios.get(`${API_URL}/students/${id}`);
    return response.data;
  }
);

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    students: [],
    selectedStudent: null,
    attendance: {},
    loading: false,
    error: null,
    total: 0,
    page: 1,
    limit: 10
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Student
      .addCase(createStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students.unshift(action.payload.data.student);
        state.total += 1;
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Student
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.students.findIndex(s => s._id === action.payload.data.student._id);
        if (index !== -1) {
          state.students[index] = action.payload.data.student;
        }
        state.selectedStudent = action.payload.data.student;
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Students
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.data.students;
        state.total = action.payload.data.total;
        state.page = action.payload.data.page;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete Student
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students = state.students.filter(student => student._id !== action.payload);
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Mark Attendance
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload.data;
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Get Attendance Report
      .addCase(getAttendanceReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAttendanceReport.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload.data;
      })
      .addCase(getAttendanceReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Get Student By ID
      .addCase(getStudentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStudent = action.payload.data;
      })
      .addCase(getStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearError } = studentSlice.actions;
export default studentSlice.reducer; 