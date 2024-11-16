import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import studentService from '../../services/studentService';

// Async thunks
export const fetchStudents = createAsyncThunk(
  'student/fetchStudents',
  async (params) => {
    const response = await studentService.getStudents(params);
    return response;
  }
);

export const fetchStudentById = createAsyncThunk(
  'student/fetchStudentById',
  async (id) => {
    const response = await studentService.getStudentById(id);
    return response;
  }
);

export const registerStudent = createAsyncThunk(
  'student/registerStudent',
  async (studentData) => {
    const response = await studentService.registerStudent(studentData);
    return response;
  }
);

export const updateStudent = createAsyncThunk(
  'student/updateStudent',
  async ({ id, data }) => {
    const response = await studentService.updateStudent(id, data);
    return response.data;
  }
);

export const deleteStudent = createAsyncThunk(
  'student/deleteStudent',
  async (id) => {
    await studentService.deleteStudent(id);
    return id;
  }
);

export const fetchPerformanceStats = createAsyncThunk(
  'student/fetchPerformanceStats',
  async ({ studentId, subject }, { rejectWithValue }) => {
    try {
      const response = await studentService.getPerformanceStats(studentId, subject);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch performance stats');
    }
  }
);

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    students: [],
    selectedStudent: null,
    loading: false,
    error: null,
    total: 0,
    page: 1,
    limit: 10,
    performanceStats: {
      overallGrade: null,
      rank: null,
      percentile: null,
      subjects: [],
      gradeTrend: [],
      subjectPerformance: [],
      assessments: []
    },
    loadingPerformance: false,
    performanceError: null,
  },
  reducers: {
    clearSelectedStudent: (state) => {
      state.selectedStudent = null;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Students
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.students;
        state.total = action.payload.total;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Student By ID
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStudent = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Register Student
      .addCase(registerStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students.unshift(action.payload);
        state.total += 1;
      })
      .addCase(registerStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Student
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.students.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
        if (state.selectedStudent?._id === action.payload._id) {
          state.selectedStudent = action.payload;
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Student
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students = state.students.filter(s => s._id !== action.payload);
        state.total -= 1;
        if (state.selectedStudent?._id === action.payload) {
          state.selectedStudent = null;
        }
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Performance Stats cases
      .addCase(fetchPerformanceStats.pending, (state) => {
        state.loadingPerformance = true;
        state.performanceError = null;
      })
      .addCase(fetchPerformanceStats.fulfilled, (state, action) => {
        state.loadingPerformance = false;
        state.performanceStats = action.payload;
        state.performanceError = null;
      })
      .addCase(fetchPerformanceStats.rejected, (state, action) => {
        state.loadingPerformance = false;
        state.performanceError = action.payload;
      });
  },
});

export const { clearSelectedStudent, setPage, setLimit } = studentSlice.actions;
export default studentSlice.reducer; 