import { configureStore } from '@reduxjs/toolkit';
import { apiErrorMiddleware } from './middleware/apiMiddleware';
import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(apiErrorMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store; 