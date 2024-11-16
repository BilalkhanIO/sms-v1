import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import classService from '../../services/classService';

export const fetchClasses = createAsyncThunk(
  'class/fetchClasses',
  async (params) => {
    const response = await classService.getClasses(params);
    return response.data;
  }
);

export const fetchClassById = createAsyncThunk(
  'class/fetchClassById',
  async (id) => {
    const response = await classService.getClassById(id);
    return response.data;
  }
);

export const createClass = createAsyncThunk(
  'class/createClass',
  async (classData) => {
    const response = await classService.createClass(classData);
    return response.data;
  }
);

export const updateClass = createAsyncThunk(
  'class/updateClass',
  async ({ id, data }) => {
    const response = await classService.updateClass(id, data);
    return response.data;
  }
);

export const deleteClass = createAsyncThunk(
  'class/deleteClass',
  async (id) => {
    await classService.deleteClass(id);
    return id;
  }
);

const classSlice = createSlice({
  name: 'class',
  initialState: {
    classes: [],
    selectedClass: null,
    loading: false,
    error: null,
    total: 0,
  },
  reducers: {
    clearSelectedClass: (state) => {
      state.selectedClass = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Classes
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload.classes;
        state.total = action.payload.total;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Class By ID
      .addCase(fetchClassById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedClass = action.payload;
      })
      .addCase(fetchClassById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create Class
      .addCase(createClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Class
      .addCase(updateClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.classes.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
        if (state.selectedClass?.id === action.payload.id) {
          state.selectedClass = action.payload;
        }
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Class
      .addCase(deleteClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = state.classes.filter(c => c.id !== action.payload);
        state.total -= 1;
        if (state.selectedClass?.id === action.payload) {
          state.selectedClass = null;
        }
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSelectedClass } = classSlice.actions;
export default classSlice.reducer;
