import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import scheduleService from '../../services/scheduleService';

export const fetchSchedules = createAsyncThunk(
  'schedule/fetchSchedules',
  async (params) => {
    const response = await scheduleService.getSchedules(params);
    return response.data;
  }
);

export const fetchScheduleById = createAsyncThunk(
  'schedule/fetchScheduleById',
  async (id) => {
    const response = await scheduleService.getScheduleById(id);
    return response.data;
  }
);

export const createSchedule = createAsyncThunk(
  'schedule/createSchedule',
  async (scheduleData) => {
    const response = await scheduleService.createSchedule(scheduleData);
    return response.data;
  }
);

export const updateSchedule = createAsyncThunk(
  'schedule/updateSchedule',
  async ({ id, data }) => {
    const response = await scheduleService.updateSchedule(id, data);
    return response.data;
  }
);

export const deleteSchedule = createAsyncThunk(
  'schedule/deleteSchedule',
  async (id) => {
    await scheduleService.deleteSchedule(id);
    return id;
  }
);

export const addPeriod = createAsyncThunk(
  'schedule/addPeriod',
  async ({ scheduleId, periodData }) => {
    const response = await scheduleService.addPeriod(scheduleId, periodData);
    return response.data;
  }
);

export const updatePeriod = createAsyncThunk(
  'schedule/updatePeriod',
  async ({ scheduleId, periodId, periodData }) => {
    const response = await scheduleService.updatePeriod(scheduleId, periodId, periodData);
    return response.data;
  }
);

export const deletePeriod = createAsyncThunk(
  'schedule/deletePeriod',
  async ({ scheduleId, periodId }) => {
    await scheduleService.deletePeriod(scheduleId, periodId);
    return { scheduleId, periodId };
  }
);

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    schedules: [],
    selectedSchedule: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedSchedule: (state) => {
      state.selectedSchedule = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Schedules
      .addCase(fetchSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Schedule By ID
      .addCase(fetchScheduleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScheduleById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSchedule = action.payload;
      })
      .addCase(fetchScheduleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create Schedule
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.schedules.push(action.payload);
      })

      // Update Schedule
      .addCase(updateSchedule.fulfilled, (state, action) => {
        const index = state.schedules.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.schedules[index] = action.payload;
        }
        if (state.selectedSchedule?.id === action.payload.id) {
          state.selectedSchedule = action.payload;
        }
      })

      // Delete Schedule
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.schedules = state.schedules.filter(s => s.id !== action.payload);
        if (state.selectedSchedule?.id === action.payload) {
          state.selectedSchedule = null;
        }
      })

      // Add Period
      .addCase(addPeriod.fulfilled, (state, action) => {
        if (state.selectedSchedule?.id === action.payload.scheduleId) {
          state.selectedSchedule.periods.push(action.payload.period);
        }
      })

      // Update Period
      .addCase(updatePeriod.fulfilled, (state, action) => {
        if (state.selectedSchedule?.id === action.payload.scheduleId) {
          const periodIndex = state.selectedSchedule.periods.findIndex(
            p => p.id === action.payload.period.id
          );
          if (periodIndex !== -1) {
            state.selectedSchedule.periods[periodIndex] = action.payload.period;
          }
        }
      })

      // Delete Period
      .addCase(deletePeriod.fulfilled, (state, action) => {
        if (state.selectedSchedule?.id === action.payload.scheduleId) {
          state.selectedSchedule.periods = state.selectedSchedule.periods.filter(
            p => p.id !== action.payload.periodId
          );
        }
      });
  },
});

export const { clearSelectedSchedule } = scheduleSlice.actions;
export default scheduleSlice.reducer;
