import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload;
      state.error = null;
      state.isLoading = false;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.error = null;
      state.isLoading = false;
    },
    setError: (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error?.data?.message || "Authentication failed";
      })
      .addMatcher(authApi.endpoints.logout.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.error = null;
        state.isLoading = false;
      })
      .addMatcher(
        authApi.endpoints.logout.matchRejected,
        (state, { error }) => {
          state.isLoading = false;
          state.error = error?.data?.message || "Logout failed";
        }
      )
      // Add matchers for forgotPassword and resetPassword if UI feedback is needed
      .addMatcher(authApi.endpoints.forgotPassword.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.forgotPassword.matchFulfilled, (state) => {
        state.isLoading = false;
      })
      .addMatcher(authApi.endpoints.resetPassword.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.resetPassword.matchFulfilled, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setCredentials, clearCredentials, setError } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => !!state.auth.user;
export const selectAuthError = (state) => state.auth.error;
export const selectIsLoading = (state) => state.auth.isLoading;

export default authSlice.reducer;
