import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService';

export const selectUsers = (state) => state.user.users;
export const selectLoading = (state) => state.user.loading;
export const selectError = (state) => state.user.error;
export const selectSuccess = (state) => state.user.success;
export const selectSelectedUser = (state) => state.user.selectedUser;
export const selectTotal = (state) => state.user.total;
export const selectPage = (state) => state.user.page;
export const selectLimit = (state) => state.user.limit;

export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (params) => {
    const response = await userService.getUsers(params);
    return response.data;
  }
);

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (id) => {
    const response = await userService.getUserById(id);
    return response.data;
  }
);

export const createUser = createAsyncThunk(
  'user/createUser',
  async (userData) => {
    const response = await userService.createUser(userData);
    return response.data;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, userData }) => {
    const response = await userService.updateUser(id, userData);
    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id) => {
    await userService.deleteUser(id);
    return id;
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ id, profileData }) => {
    const response = await userService.updateProfile(id, profileData);
    return response.data;
  }
);

export const uploadProfilePicture = createAsyncThunk(
  'user/uploadProfilePicture',
  async ({ id, file }) => {
    const response = await userService.uploadProfilePicture(id, file);
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    selectedUser: null,
    currentUserProfile: null,
    loading: false,
    error: null,
    success: false,
    total: 0,
    page: 1,
    limit: 10,
  },
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.total = action.payload.total;
        state.success = true;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch User By ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create User
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
        state.total += 1;
        state.success = true;
      })

      // Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
        state.success = true;
      })

      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
        state.total -= 1;
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
        state.success = true;
      })

      // Update Profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
        if (state.currentUserProfile?.id === action.payload.id) {
          state.currentUserProfile = action.payload;
        }
      })

      // Upload Profile Picture
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser.profilePicture = action.payload.profilePicture;
        }
        if (state.currentUserProfile?.id === action.payload.id) {
          state.currentUserProfile.profilePicture = action.payload.profilePicture;
        }
      });
  },
});

export const {
  clearSelectedUser,
  setPage,
  setLimit,
  clearError,
  clearSuccess,
  setSelectedUser
} = userSlice.actions;

export default userSlice.reducer;