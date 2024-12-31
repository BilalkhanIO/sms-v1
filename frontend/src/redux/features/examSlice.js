import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import examService from '../../services/examService';

export const fetchExams = createAsyncThunk(
  'exam/fetchExams',
  async (params) => {
    const response = await examService.getExams(params);
    return response.data;
  }
);

export const fetchExamById = createAsyncThunk(
  'exam/fetchExamById',
  async (id) => {
    const response = await examService.getExamById(id);
    return response.data;
  }
);

export const createExam = createAsyncThunk(
  'exam/createExam',
  async (examData) => {
    const response = await examService.createExam(examData);
    return response.data;
  }
);

export const updateExam = createAsyncThunk(
  'exam/updateExam',
  async ({ id, data }) => {
    const response = await examService.updateExam(id, data);
    return response.data;
  }
);

export const deleteExam = createAsyncThunk(
  'exam/deleteExam',
  async (id) => {
    await examService.deleteExam(id);
    return id;
  }
);

export const scheduleExam = createAsyncThunk(
  'exam/scheduleExam',
  async ({ examId, scheduleData }) => {
    const response = await examService.scheduleExam(examId, scheduleData);
    return response.data;
  }
);

export const submitResults = createAsyncThunk(
  'exam/submitResults',
  async ({ examId, resultsData }) => {
    const response = await examService.submitResults(examId, resultsData);
    return response.data;
  }
);

const examSlice = createSlice({
  name: 'exam',
  initialState: {
    exams: [],
    selectedExam: null,
    results: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedExam: (state) => {
      state.selectedExam = null;
    },
    clearExamResults: (state) => {
      state.results = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Exams
      .addCase(fetchExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = action.payload;
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Exam By ID
      .addCase(fetchExamById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedExam = action.payload;
      })
      .addCase(fetchExamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create Exam
      .addCase(createExam.fulfilled, (state, action) => {
        state.exams.unshift(action.payload);
      })

      // Update Exam
      .addCase(updateExam.fulfilled, (state, action) => {
        const index = state.exams.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.exams[index] = action.payload;
        }
        if (state.selectedExam?.id === action.payload.id) {
          state.selectedExam = action.payload;
        }
      })

      // Delete Exam
      .addCase(deleteExam.fulfilled, (state, action) => {
        state.exams = state.exams.filter(e => e.id !== action.payload);
        if (state.selectedExam?.id === action.payload) {
          state.selectedExam = null;
        }
      })

      // Schedule Exam
      .addCase(scheduleExam.fulfilled, (state, action) => {
        const index = state.exams.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.exams[index] = action.payload;
        }
        if (state.selectedExam?.id === action.payload.id) {
          state.selectedExam = action.payload;
        }
      })

      // Submit Results
      .addCase(submitResults.fulfilled, (state, action) => {
        if (state.selectedExam?.id === action.payload.examId) {
          state.results = action.payload.results;
        }
      });
  },
});

export const { clearSelectedExam, clearExamResults } = examSlice.actions;
export default examSlice.reducer;