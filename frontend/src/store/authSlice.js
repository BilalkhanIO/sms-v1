// src/store/authSlice.js

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
    },
    clearCredentials: (state) => {
      state.user = null;
      state.error = null;
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
      .addMatcher(
        authApi.endpoints.login.matchRejected,
        (state, { payload }) => {
          state.isLoading = false;
          state.error = payload?.error || "Authentication failed";
        }
      )
      // Logout (Keep these extraReducers for logout related state)
      .addMatcher(authApi.endpoints.logout.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.error = null;
        state.isLoading = false;
      })
      .addMatcher(
        authApi.endpoints.logout.matchRejected,
        (state, { payload }) => {
          state.isLoading = false;
          state.error = payload?.error || "Logout failed";
        }
      )
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.data;
          state.isLoading = false;
          state.error = null;
        }
      );
  },
});

console.log((state) => state.auth.user);

export const { setCredentials, clearCredentials, setError } = authSlice.actions; // <-----  MAKE SURE setCredentials IS EXPORTED

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => !!state.auth.user;
export const selectIsLoading = (state) => state.auth.isLoading;

export default authSlice.reducer;
