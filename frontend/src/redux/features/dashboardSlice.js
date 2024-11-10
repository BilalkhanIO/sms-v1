import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async () => {
    // TODO: Replace with actual API call
    return {
      totalStudents: 250,
      totalTeachers: 25,
      feeCollection: 50000,
      attendanceRate: 95,
      examPassRate: 88,
      totalBooks: 1200,
    };
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: {
      totalStudents: 0,
      totalTeachers: 0,
      feeCollection: 0,
      attendanceRate: 0,
      examPassRate: 0,
      totalBooks: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.loading = false;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default dashboardSlice.reducer; 