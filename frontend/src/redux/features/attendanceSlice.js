import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Fetch attendance records for a class on a specific date
export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async ({ classId, date }) => {
    const response = await api.get(`/attendance/${classId}`, {
      params: { date },
    });
    return response.data;
  }
);

// Mark attendance for multiple students
export const markAttendance = createAsyncThunk(
  'attendance/markAttendance',
  async ({ classId, date, attendance }) => {
    const response = await api.post('/attendance', {
      classId,
      date,
      attendance,
    });
    return response.data;
  }
);

// Fetch attendance report for a student
export const fetchStudentAttendanceReport = createAsyncThunk(
  'attendance/fetchStudentReport',
  async ({ studentId, startDate, endDate }) => {
    const response = await api.get(`/attendance/student/${studentId}/report`, {
      params: { startDate, endDate },
    });
    return response.data;
  }
);

// Fetch attendance report for a class
export const fetchClassAttendanceReport = createAsyncThunk(
  'attendance/fetchClassReport',
  async ({ classId, startDate, endDate }) => {
    const response = await api.get(`/attendance/class/${classId}/report`, {
      params: { startDate, endDate },
    });
    return response.data;
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    attendance: {},
    studentReport: null,
    classReport: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAttendanceError: (state) => {
      state.error = null;
    },
    clearAttendanceData: (state) => {
      state.attendance = {};
      state.studentReport = null;
      state.classReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Attendance
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Mark Attendance
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = {
          ...state.attendance,
          ...action.payload,
        };
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Student Report
      .addCase(fetchStudentAttendanceReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentAttendanceReport.fulfilled, (state, action) => {
        state.loading = false;
        state.studentReport = action.payload;
      })
      .addCase(fetchStudentAttendanceReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Class Report
      .addCase(fetchClassAttendanceReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassAttendanceReport.fulfilled, (state, action) => {
        state.loading = false;
        state.classReport = action.payload;
      })
      .addCase(fetchClassAttendanceReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearAttendanceError, clearAttendanceData } = attendanceSlice.actions;
export default attendanceSlice.reducer; 