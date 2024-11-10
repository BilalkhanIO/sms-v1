import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchClasses = createAsyncThunk(
  'academic/fetchClasses',
  async () => {
    const response = await axios.get(`${API_URL}/classes`);
    return response.data;
  }
);

export const fetchSubjects = createAsyncThunk(
  'academic/fetchSubjects',
  async () => {
    const response = await axios.get(`${API_URL}/subjects`);
    return response.data;
  }
);

const academicSlice = createSlice({
  name: 'academic',
  initialState: {
    classes: [],
    subjects: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Classes
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload.data;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Subjects
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload.data;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearError } = academicSlice.actions;
export default academicSlice.reducer; 