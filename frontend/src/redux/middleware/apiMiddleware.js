import { isRejectedWithValue } from '@reduxjs/toolkit';
import { logout } from '../features/authSlice';

export const apiErrorMiddleware = (store) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    // Handle specific error cases
    if (action.payload?.statusCode === 401) {
      store.dispatch(logout());
    }

    // Log the error with more details
    console.error('API Error:', {
      type: action.type,
      payload: action.payload,
      error: action.error
    });
  }

  return next(action);
};
