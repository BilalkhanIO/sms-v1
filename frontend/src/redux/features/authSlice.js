// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
  isAuthenticated: false,
  authChecked: false,
  requires2FA: false,
  twoFactorEnabled: false,
  activeDevices: [],
  registerSuccess: false,
  forgotPasswordSuccess: false,
  resetPasswordSuccess: false,
  emailVerificationSuccess: false,
  updatePasswordSuccess: false
};

// Async Thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      const data = await authService.verifyEmail(token);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const data = await authService.forgotPassword(email);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const data = await authService.resetPassword(token, password);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (passwords, { rejectWithValue }) => {
    try {
      const data = await authService.updatePassword(passwords);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const enable2FA = createAsyncThunk(
  'auth/enable2FA',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.enable2FA();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const disable2FA = createAsyncThunk(
  'auth/disable2FA',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.disable2FA();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getActiveDevices = createAsyncThunk(
  'auth/getActiveDevices',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.getActiveDevices();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeDevice = createAsyncThunk(
  'auth/removeDevice',
  async (deviceId, { rejectWithValue }) => {
    try {
      const data = await authService.removeDevice(deviceId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.getProfile();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAllSuccess: (state) => {
      state.forgotPasswordSuccess = false;
      state.resetPasswordSuccess = false;
      state.registerSuccess = false;
      state.emailVerificationSuccess = false;
      state.updatePasswordSuccess = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.requires2FA = false;
      state.twoFactorEnabled = false;
      state.activeDevices = [];
      localStorage.removeItem('token');
    },
    setAuthChecked: (state) => {
      state.authChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.requires2FA) {
          state.requires2FA = true;
        } else {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.requires2FA = false;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.registerSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Email Verification
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.emailVerificationSuccess = true;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.forgotPasswordSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetPasswordSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Password
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
        state.updatePasswordSuccess = true;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 2FA
      .addCase(enable2FA.fulfilled, (state, action) => {
        state.twoFactorEnabled = true;
        state.twoFactorSecret = action.payload.data.secret;
        state.twoFactorQRCode = action.payload.data.otpAuthUrl;
      })
      .addCase(disable2FA.fulfilled, (state) => {
        state.twoFactorEnabled = false;
        state.twoFactorSecret = null;
        state.twoFactorQRCode = null;
      })

      // Devices
      .addCase(getActiveDevices.fulfilled, (state, action) => {
        state.activeDevices = action.payload.data;
      })
      .addCase(removeDevice.fulfilled, (state, action) => {
        state.activeDevices = state.activeDevices.filter(
          device => device.deviceId !== action.meta.arg
        );
      })

      // Profile
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.isAuthenticated = true;
      });
  },
});

export const {
  clearError,
  clearAllSuccess,
  logout,
  setAuthChecked
} = authSlice.actions;

export default authSlice.reducer;
