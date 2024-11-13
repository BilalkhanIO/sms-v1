import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import userReducer from './features/userSlice';
import feeReducer from './features/feeSlice';
import calendarReducer from './features/calendarSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    fee: feeReducer,
    calendar: calendarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 