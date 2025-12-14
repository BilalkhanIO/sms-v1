import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from "../api/api";
import { schoolsApi } from '../api/schoolsApi';
import { settingsApi } from '../api/settingsApi';
import { activityLogsApi } from '../api/activityLogsApi';
import { calendarApi } from '../api/calendarApi';
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [schoolsApi.reducerPath]: schoolsApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [activityLogsApi.reducerPath]: activityLogsApi.reducer,
    [calendarApi.reducerPath]: calendarApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      api.middleware,
      schoolsApi.middleware,
      settingsApi.middleware,
      activityLogsApi.middleware,
      calendarApi.middleware
    ),
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in dev
});

setupListeners(store.dispatch);

export default store;
