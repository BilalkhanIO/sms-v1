import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import dashboardReducer from './features/dashboardSlice';
import userReducer from './features/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 