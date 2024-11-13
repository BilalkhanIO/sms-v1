import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchFeeStats = createAsyncThunk(
  'fee/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/fees/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch fee stats');
    }
  }
);

const initialState = {
  stats: {
    totalStudents: 0,
    totalCollection: 0,
    totalOutstanding: 0,
    collectionRate: 0,
    defaulterCount: 0,
    collectionTrend: [],
    feeTypeDistribution: [],
    classWiseCollection: [],
    paymentMethodDistribution: []
  },
  loading: false,
  error: null,
};

const feeSlice = createSlice({
  name: 'fee',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchFeeStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default feeSlice.reducer; 