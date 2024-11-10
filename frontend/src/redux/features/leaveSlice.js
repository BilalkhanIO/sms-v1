import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchLeaveRequests = createAsyncThunk(
  'leave/fetchRequests',
  async ({ userType, status }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/leave-requests`, {
        params: { userType, status }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const submitLeaveRequest = createAsyncThunk(
  'leave/submitRequest',
  async (leaveData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/leave-requests', leaveData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateLeaveStatus = createAsyncThunk(
  'leave/updateStatus',
  async ({ requestId, status, remarks }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/leave-requests/${requestId}`, {
        status,
        remarks
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const leaveSlice = createSlice({
  name: 'leave',
  initialState: {
    requests: [],
    loading: false,
    error: null,
    stats: {
      pending: 0,
      approved: 0,
      rejected: 0
    }
  },
  reducers: {
    updateLeaveStats: (state, action) => {
      state.stats = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch leave requests';
      })
      .addCase(submitLeaveRequest.fulfilled, (state, action) => {
        state.requests.unshift(action.payload);
      })
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        const index = state.requests.findIndex(
          request => request.id === action.payload.id
        );
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
      });
  },
});

export const { updateLeaveStats } = leaveSlice.actions;
export default leaveSlice.reducer; 