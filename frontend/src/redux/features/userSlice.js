import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk actions
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      if (!id) throw new Error('User ID is required');
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const uploadProfilePicture = createAsyncThunk(
  'user/uploadProfilePicture',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      const response = await api.post('/users/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload picture');
    }
  }
);

export const createUser = createAsyncThunk(
  'user/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const formattedData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        status: userData.status,
      };

      const response = await api.post('/users', formattedData);
      return response.data;
    } catch (error) {
      console.error('Create user error:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to create user'
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error('User ID is required');
      await api.delete(`/users/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

// Initial state
const initialState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  success: false,
  profileUpdateSuccess: false,
  profilePictureUpdateSuccess: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.profileUpdateSuccess = false;
      state.profilePictureUpdateSuccess = false;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
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
        state.users = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.profileUpdateSuccess = false;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.loading = false;
        state.profileUpdateSuccess = true;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.profileUpdateSuccess = false;
      })

      // Upload Profile Picture
      .addCase(uploadProfilePicture.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.profilePictureUpdateSuccess = false;
      })
      .addCase(uploadProfilePicture.fulfilled, (state) => {
        state.loading = false;
        state.profilePictureUpdateSuccess = true;
        state.error = null;
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.profilePictureUpdateSuccess = false;
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearError,
  clearSuccess,
  setSelectedUser,
  clearSelectedUser,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;

// Selectors
export const selectUsers = (state) => state.user.users;
export const selectLoading = (state) => state.user.loading;
export const selectError = (state) => state.user.error;
export const selectSuccess = (state) => state.user.success;
export const selectSelectedUser = (state) => state.user.selectedUser;
export const selectProfileUpdateSuccess = (state) => state.user.profileUpdateSuccess;
export const selectProfilePictureUpdateSuccess = (state) => state.user.profilePictureUpdateSuccess;