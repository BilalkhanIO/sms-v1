import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock data for initial state
const initialEvents = [
  {
    id: 1,
    title: 'Parent-Teacher Meeting',
    start: new Date(2024, 2, 15, 10, 0),
    end: new Date(2024, 2, 15, 12, 0),
    description: 'Annual parent-teacher meeting',
    type: 'meeting',
    color: 'indigo'
  }
];

export const fetchEvents = createAsyncThunk(
  'calendar/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/calendar/events');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

export const createEvent = createAsyncThunk(
  'calendar/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await api.post('/calendar/events', eventData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create event');
    }
  }
);

export const updateEvent = createAsyncThunk(
  'calendar/updateEvent',
  async ({ id, eventData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/calendar/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update event');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'calendar/deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/calendar/events/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete event');
    }
  }
);

const initialState = {
  events: [],
  loading: false,
  error: null,
  selectedEvent: null,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
        state.error = null;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(event => event.id !== action.payload);
      });
  },
});

export const { setSelectedEvent, clearSelectedEvent } = calendarSlice.actions;
export default calendarSlice.reducer; 