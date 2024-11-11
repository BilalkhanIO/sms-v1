import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { getState }) => {
    const { auth } = getState();
    const role = auth.user?.role.toLowerCase();
    const response = await api.get(`/api/dashboard/stats/${role}`);
    return response.data;
  }
);

export const fetchRecentActivities = createAsyncThunk(
  'dashboard/fetchActivities',
  async () => {
    const response = await api.get('/api/dashboard/activities');
    return response.data;
  }
);

export const fetchUpcomingClasses = createAsyncThunk(
  'dashboard/fetchClasses',
  async () => {
    const response = await api.get('/api/dashboard/upcoming-classes');
    return response.data;
  }
);

export const fetchAttendanceData = createAsyncThunk(
  'dashboard/fetchAttendance',
  async (params) => {
    const response = await api.get('/api/dashboard/attendance', { params });
    return response.data;
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: {
      totalStudents: 0,
      totalTeachers: 0,
      totalClasses: 0,
      attendanceRate: 0,
      studentTrend: 0,
      teacherTrend: 0,
      classTrend: 0,
      attendanceTrend: 0,
    },
    teacherStats: {
      totalClasses: 0,
      totalStudents: 0,
      attendanceRate: 0,
      pendingAssignments: 0,
      classTrend: 0,
      studentTrend: 0,
      attendanceTrend: 0,
    },
    studentStats: {
      attendance: 0,
      performance: 0,
      assignments: 0,
      upcomingExams: 0,
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
  },
  reducers: {
    clearDashboard: (state) => {
      state = { ...state.initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading.stats = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        const { role, data } = action.payload;
        if (role === 'teacher') {
          state.teacherStats = data;
        } else if (role === 'student') {
          state.studentStats = data;
        } else {
          state.stats = data;
        }
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