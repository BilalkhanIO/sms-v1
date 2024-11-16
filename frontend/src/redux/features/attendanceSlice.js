import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import attendanceService from '../../services/attendanceService';

export const fetchAttendanceStats = createAsyncThunk(
  'attendance/fetchStats',
  async (params) => {
    const response = await attendanceService.getAttendanceStats(params);
    return response.data;
  }
);

export const markAttendance = createAsyncThunk(
  'attendance/mark',
  async ({ classId, date, attendanceData }) => {
    const response = await attendanceService.markAttendance(classId, date, attendanceData);
    return response.data;
  }
);

export const fetchAttendanceReport = createAsyncThunk(
  'attendance/fetchReport',
  async (params) => {
    const response = await attendanceService.getAttendanceReport(params);
    return response.data;
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    stats: {
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      attendanceRate: 0,
    },
    reports: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAttendanceData: (state) => {
      state.stats = {
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        attendanceRate: 0,
      };
      state.reports = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Stats
      .addCase(fetchAttendanceStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAttendanceStats.rejected, (state, action) => {
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
        // Update stats after marking attendance
        state.stats = {
          ...state.stats,
          ...action.payload.stats,
        };
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Report
      .addCase(fetchAttendanceReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchAttendanceReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearAttendanceData } = attendanceSlice.actions;
export default attendanceSlice.reducer; 