import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async () => {
    const response = await api.get('/users');
    return response.data;
  }
);

export const createUser = createAsyncThunk(
  'user/createUser',
  async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ userId, userData }) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId) => {
    await api.delete(`/users/${userId}`);
    return userId;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create User
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      // Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer; 