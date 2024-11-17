// route reducer
import { combineReducers } from '@reduxjs/toolkit';

// Create a function that takes reducers as arguments
const createRootReducer = (authReducer, userReducer, profileReducer) => {
  return combineReducers({
    auth: authReducer,
    user: userReducer,
    profile: profileReducer,
  });
};

export default createRootReducer;

