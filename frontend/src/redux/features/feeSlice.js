import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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

export const generateFeeInvoices = createAsyncThunk(
  'fee/generateInvoices',
  async ({ classId, month }, { rejectWithValue }) => {
    try {
      const response = await api.post('/fees/generate-invoices', {
        classId,
        month
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate fee invoices');
    }
  }
);

export const recordFeePayment = createAsyncThunk(
  'fee/recordPayment',
  async ({ invoiceId, amount, paymentMethod, paymentDate, transactionId, remarks }, { rejectWithValue }) => {
    try {
      const response = await api.post('/fees/record-payment', {
        invoiceId,
        amount,
        paymentMethod,
        paymentDate,
        transactionId,
        remarks
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to record fee payment');
    }
  }
);

export const createFeeStructure = createAsyncThunk(
  'fee/createStructure',
  async (feeStructureData, { rejectWithValue }) => {
    try {
      const response = await api.post('/fees/structures', {
        name: feeStructureData.name,
        type: feeStructureData.type,
        amount: feeStructureData.amount,
        description: feeStructureData.description,
        applicableClasses: feeStructureData.applicableClasses,
        dueDay: feeStructureData.dueDay,
        lateFeePercentage: feeStructureData.lateFeePercentage,
        discountEligibility: feeStructureData.discountEligibility
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create fee structure');
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
  generatingInvoices: false,
  generateError: null,
  recordingPayment: false,
  recordPaymentError: null,
  structures: [],
  creatingStructure: false,
  createStructureError: null,
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
      })
      .addCase(generateFeeInvoices.pending, (state) => {
        state.generatingInvoices = true;
        state.generateError = null;
      })
      .addCase(generateFeeInvoices.fulfilled, (state) => {
        state.generatingInvoices = false;
        state.generateError = null;
      })
      .addCase(generateFeeInvoices.rejected, (state, action) => {
        state.generatingInvoices = false;
        state.generateError = action.payload;
      })
      .addCase(recordFeePayment.pending, (state) => {
        state.recordingPayment = true;
        state.recordPaymentError = null;
      })
      .addCase(recordFeePayment.fulfilled, (state) => {
        state.recordingPayment = false;
        state.recordPaymentError = null;
      })
      .addCase(recordFeePayment.rejected, (state, action) => {
        state.recordingPayment = false;
        state.recordPaymentError = action.payload;
      })
      .addCase(createFeeStructure.pending, (state) => {
        state.creatingStructure = true;
        state.createStructureError = null;
      })
      .addCase(createFeeStructure.fulfilled, (state, action) => {
        state.creatingStructure = false;
        state.createStructureError = null;
        state.structures.push(action.payload);
      })
      .addCase(createFeeStructure.rejected, (state, action) => {
        state.creatingStructure = false;
        state.createStructureError = action.payload;
      });
  },
});

export default feeSlice.reducer; 