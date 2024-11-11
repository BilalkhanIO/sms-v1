import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import dashboardReducer from './features/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 