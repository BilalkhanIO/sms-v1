// src/store/classSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api'; // Your API client

// Fetch all classes
export const fetchClasses = createAsyncThunk('classes/fetchAll', async () => {
  try {
    const response = await API.get('/classes');
    return response.data;


  } catch (error) {
    return rejectWithValue(error.response.data); // Handle errors and send to reducer
  }
});

// Fetch single class by ID
export const fetchClassById = createAsyncThunk('classes/fetchById', async (id, { rejectWithValue }) => {
  try {
    const response = await API.get(`/classes/${id}?populate=classTeacher,user&populate=subjects.subject,user&populate=students,user`); // Populate!
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Create a new class
export const createClass = createAsyncThunk('classes/create', async (classData, { rejectWithValue }) => {
  try {
    const response = await API.post('/classes', classData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Update an existing class
export const updateClass = createAsyncThunk('classes/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await API.put(`/classes/${id}`, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Delete a class
export const deleteClass = createAsyncThunk('classes/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await API.delete(`/classes/${id}`);
    if(response.status === 200) {
      return id;
    } else {
      return rejectWithValue("Failed to delete")
    }
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Add a student to a class
export const addStudentToClass = createAsyncThunk('classes/addStudent', async ({ classId, studentId }, { rejectWithValue }) => {
  try {
    const response = await API.put(`/classes/${classId}/students`, { studentId });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Remove a student from a class
export const removeStudentFromClass = createAsyncThunk('classes/removeStudent', async ({ classId, studentId }, { rejectWithValue }) => {
  try {
    const response = await API.delete(`/classes/${classId}/students/${studentId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const classSlice = createSlice({
  name: 'classes',
  initialState: {
    items: [],
    item: null, // For single class details
    status: 'idle',
    error: null,
  },
  reducers: {}, // You can add non-async reducers here if needed
  extraReducers: (builder) => {
    // Generic pending state handler
    const handlePending = (state) => {
      state.status = 'loading';
      state.error = null;
    };

    // Generic fulfilled state handler for arrays of classes
    const handleFulfilledClasses = (state, action) => {
      state.status = 'succeeded';
      state.items = action.payload;
    };

    // Generic fulfilled state handler for a single class
    const handleFulfilledClass = (state, action) => {
      state.status = 'succeeded';
      state.item = action.payload;
    };

    // Generic rejected state handler
    const handleRejected = (state, action) => {
      state.status = 'failed';
      state.error = action.payload; // Set the error message from the server
    };

    // Fetch all classes
    builder.addCase(fetchClasses.pending, handlePending);
    builder.addCase(fetchClasses.fulfilled, handleFulfilledClasses);
    builder.addCase(fetchClasses.rejected, handleRejected);

    // Fetch single class
    builder.addCase(fetchClassById.pending, handlePending);
    builder.addCase(fetchClassById.fulfilled, handleFulfilledClass);
    builder.addCase(fetchClassById.rejected, handleRejected);

    // Create class
    builder.addCase(createClass.pending, handlePending);
    builder.addCase(createClass.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.items.push(action.payload); // Add the new class to the list
    });
    builder.addCase(createClass.rejected, handleRejected);

    // Update class
    builder.addCase(updateClass.pending, handlePending);
    builder.addCase(updateClass.fulfilled, (state, action) => {
      state.status = 'succeeded';
      const index = state.items.findIndex((cls) => cls._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload; // Update the class in the list
      }
      state.item = action.payload
    });
    builder.addCase(updateClass.rejected, handleRejected);

    // Delete class
    builder.addCase(deleteClass.pending, handlePending);
    builder.addCase(deleteClass.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.items = state.items.filter((cls) => cls._id !== action.payload); // Remove the class from the list
      state.item = null
    });
    builder.addCase(deleteClass.rejected, handleRejected);

    // Add student to class
    builder.addCase(addStudentToClass.pending, handlePending);
    builder.addCase(addStudentToClass.fulfilled, handleFulfilledClass); // Class details are updated
    builder.addCase(addStudentToClass.rejected, handleRejected);

    // Remove student from class
    builder.addCase(removeStudentFromClass.pending, handlePending);
    builder.addCase(removeStudentFromClass.fulfilled, handleFulfilledClass); // Class details are updated
    builder.addCase(removeStudentFromClass.rejected, handleRejected);
  },
});

export default classSlice.reducer;