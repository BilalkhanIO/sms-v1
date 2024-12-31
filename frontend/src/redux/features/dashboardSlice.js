import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (role, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getStats(role);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRecentActivities = createAsyncThunk(
  'dashboard/fetchActivities',
  async () => {
    const response = await api.get('/dashboard/activities');
    return response.data;
  }
);

export const fetchUpcomingClasses = createAsyncThunk(
  'dashboard/fetchClasses',
  async () => {
    const response = await api.get('/dashboard/upcoming-classes');
    return response.data;
  }
);

export const fetchAttendanceData = createAsyncThunk(
  'dashboard/fetchAttendance',
  async (params) => {
    const response = await api.get('/dashboard/attendance', { params });
    return response.data;
  }
);

const initialState = {
  stats: {
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    attendanceRate: 0,
    studentTrend: 0,
    teacherTrend: 0,
    classTrend: 0,
    attendanceTrend: 0,
    totalRevenue: 0,
    revenueTrend: 0,
    averagePerformance: 0,
    performanceTrend: 0,
  },
  teacherStats: {
    totalClasses: 0,
    totalStudents: 0,
    attendanceRate: 0,
    pendingTasks: 0,
    classTrend: 0,
    studentTrend: 0,
    attendanceTrend: 0,
  },
  studentStats: {
    attendance: 0,
    performance: 0,
    assignments: {
      completed: 0,
      total: 0,
    },
    upcomingTests: 0,
    overallGrade: 'N/A',
    gradeTrend: 0,
  },
  upcomingClasses: [],
  attendanceData: [],
  recentActivities: [],
  performanceData: [],
  loading: {
    stats: false,
    activities: false,
    classes: false,
    attendance: false,
  },
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboard: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading.stats = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        const { role, data } = action.payload;
        
        switch (role) {
          case 'teacher':
            state.teacherStats = data;
            break;
          case 'student':
            state.studentStats = data;
            break;
          default:
            state.stats = data;
        }
        state.error = null;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error = action.error.message;
      })
      
      // Activities
      .addCase(fetchRecentActivities.pending, (state) => {
        state.loading.activities = true;
      })
      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.loading.activities = false;
        state.recentActivities = action.payload;
      })
      .addCase(fetchRecentActivities.rejected, (state, action) => {
        state.loading.activities = false;
        state.error = action.error.message;
      })
      
      // Classes
      .addCase(fetchUpcomingClasses.pending, (state) => {
        state.loading.classes = true;
      })
      .addCase(fetchUpcomingClasses.fulfilled, (state, action) => {
        state.loading.classes = false;
        state.upcomingClasses = action.payload;
      })
      .addCase(fetchUpcomingClasses.rejected, (state, action) => {
        state.loading.classes = false;
        state.error = action.error.message;
      })
      
      // Attendance
      .addCase(fetchAttendanceData.pending, (state) => {
        state.loading.attendance = true;
      })
      .addCase(fetchAttendanceData.fulfilled, (state, action) => {
        state.loading.attendance = false;
        state.attendanceData = action.payload;
      })
      .addCase(fetchAttendanceData.rejected, (state, action) => {
        state.loading.attendance = false;
        state.error = action.error.message;
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;