import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchExams = createAsyncThunk(
  'exam/fetchExams',
  async () => {
    const response = await fetch('/api/exams');
    return response.json();
  }
);

export const createExam = createAsyncThunk(
  'exam/createExam',
  async (examData) => {
    const response = await fetch('/api/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(examData),
    });
    return response.json();
  }
);

export const scheduleExam = createAsyncThunk(
  'exam/scheduleExam',
  async (scheduleData) => {
    const response = await fetch('/api/exams/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scheduleData),
    });
    return response.json();
  }
);

export const updateExam = createAsyncThunk(
  'exam/updateExam',
  async ({ id, examData }) => {
    const response = await fetch(`/api/exams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(examData),
    });
    return response.json();
  }
);

export const deleteExam = createAsyncThunk(
  'exam/deleteExam',
  async (id) => {
    await fetch(`/api/exams/${id}`, { method: 'DELETE' });
    return id;
  }
);

const examSlice = createSlice({
  name: 'exam',
  initialState: {
    exams: [],
    schedules: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearExamError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchExams
      .addCase(fetchExams.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.exams = action.payload;
        state.loading = false;
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // Handle createExam
      .addCase(createExam.pending, (state) => {
        state.loading = true;
      })
      .addCase(createExam.fulfilled, (state, action) => {
        state.exams.push(action.payload);
        state.loading = false;
      })
      .addCase(createExam.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // Handle scheduleExam
      .addCase(scheduleExam.pending, (state) => {
        state.loading = true;
      })
      .addCase(scheduleExam.fulfilled, (state, action) => {
        const examIndex = state.exams.findIndex(
          (exam) => exam.id === action.payload.examId
        );
        if (examIndex !== -1) {
          state.exams[examIndex].schedules = action.payload.schedules;
        }
        state.loading = false;
      })
      .addCase(scheduleExam.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // Handle updateExam
      .addCase(updateExam.fulfilled, (state, action) => {
        const index = state.exams.findIndex((exam) => exam.id === action.payload.id);
        if (index !== -1) {
          state.exams[index] = action.payload;
        }
      })
      // Handle deleteExam
      .addCase(deleteExam.fulfilled, (state, action) => {
        state.exams = state.exams.filter((exam) => exam.id !== action.payload);
      });
  },
});

export const { clearExamError } = examSlice.actions;
export default examSlice.reducer; 