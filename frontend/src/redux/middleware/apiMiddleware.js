import { isRejectedWithValue } from '@reduxjs/toolkit';

export const apiErrorMiddleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    // You can add global error handling here
    console.error('API Error:', action.payload);
    
    // You could dispatch actions to show notifications
    // store.dispatch(showNotification({ message: action.payload.message, type: 'error' }));
  }

  return next(action);
};
