import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import subjectService from '../../services/subjectService';
import produce from 'immer';

export const fetchSubjects = createAsyncThunk(
  'subject/fetchSubjects',
  async (params) => {
    const response = await subjectService.getSubjects(params);
    return response.data;
  }
);

export const fetchSubjectById = createAsyncThunk(
  'subject/fetchSubjectById',
  async (id) => {
    const response = await subjectService.getSubjectById(id);
    return response.data;
  }
);

export const createSubject = createAsyncThunk(
  'subject/createSubject',
  async (subjectData) => {
    const response = await subjectService.createSubject(subjectData);
    return response.data;
  }
);

export const updateSubject = createAsyncThunk(
  'subject/updateSubject',
  async ({ id, data }) => {
    const response = await subjectService.updateSubject(id, data);
    return response.data;
  }
);

export const deleteSubject = createAsyncThunk(
  'subject/deleteSubject',
  async (id) => {
    await subjectService.deleteSubject(id);
    return id;
  }
);

export const uploadMaterial = createAsyncThunk(
  'subject/uploadMaterial',
  async ({ subjectId, materialData }) => {
    const response = await subjectService.uploadMaterial(subjectId, materialData);
    return response.data;
  }
);

const subjectSlice = createSlice({
  name: 'subject',
  initialState: {
    subjects: [],
    selectedSubject: null,
    loading: false,
    error: null,
    total: 0,
  },
  reducers: {
    clearSelectedSubject: (state) => {
      state.selectedSubject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Subjects
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload.subjects;
        state.total = action.payload.total;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Subject By ID
      .addCase(fetchSubjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubject = action.payload;
      })
      .addCase(fetchSubjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create Subject
      .addCase(createSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Subject
      .addCase(updateSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.subjects.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.subjects[index] = action.payload;
        }
        if (state.selectedSubject?.id === action.payload.id) {
          state.selectedSubject = action.payload;
        }
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Subject
      .addCase(deleteSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = state.subjects.filter(s => s.id !== action.payload);
        state.total -= 1;
        if (state.selectedSubject?.id === action.payload) {
          state.selectedSubject = null;
        }
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Upload Material
      .addCase(uploadMaterial.fulfilled, (state, action) => {
        if (state.selectedSubject?.id === action.payload.subjectId) {
          state.selectedSubject.materials = [
            ...state.selectedSubject.materials,
            action.payload.material
          ];
        }
      });
  },
});

export const { clearSelectedSubject } = subjectSlice.actions;
export default subjectSlice.reducer;
