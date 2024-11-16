// route reducer
import { combineReducers } from 'redux';
import userReducer from './features/userSlice';
import examReducer from './features/examSlice';
import attendanceReducer from './features/attendanceSlice';
import authReducer from './features/authSlice';

const rootReducer = combineReducers({
  user: userReducer,
  exam: examReducer,
  attendance: attendanceReducer,
  auth: authReducer,
});

export default rootReducer;

