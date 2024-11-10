import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchFeeStats = createAsyncThunk(
  'fee/fetchStats',
  async () => {
    const response = await fetch('/api/fee/stats');
    return response.json();
  }
);

export const generateInvoice = createAsyncThunk(
  'fee/generateInvoice',
  async (data) => {
    const response = await fetch('/api/fee/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
);

export const processPayment = createAsyncThunk(
  'fee/processPayment',
  async (data) => {
    const response = await fetch('/api/fee/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
);

export const updateFeeSettings = createAsyncThunk(
  'fee/updateSettings',
  async (data) => {
    const response = await fetch('/api/fee/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
);

const feeSlice = createSlice({
  name: 'fee',
  initialState: {
    stats: {
      totalCollection: 0,
      totalOutstanding: 0,
      defaulterCount: 0,
      collectionRate: 0,
      collectionTrend: [],
      feeTypeDistribution: [],
      classWiseCollection: [],
      paymentMethodDistribution: [],
    },
    structures: [],
    templates: [],
    invoices: [],
    settings: {
      enableLateFees: false,
      lateFeePercentage: 0,
      gracePeriod: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {
    // Add any synchronous reducers here
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchFeeStats
      .addCase(fetchFeeStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeeStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.loading = false;
      })
      .addCase(fetchFeeStats.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // Handle generateInvoice
      .addCase(generateInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateInvoice.fulfilled, (state, action) => {
        state.invoices.push(action.payload);
        state.loading = false;
      })
      .addCase(generateInvoice.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // Handle processPayment
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        // Update invoice status and stats
        state.loading = false;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // Handle updateFeeSettings
      .addCase(updateFeeSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      });
  },
});

export default feeSlice.reducer; 