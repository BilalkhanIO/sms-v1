import { configureStore } from "@reduxjs/toolkit";
import { api } from "../api/api";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in dev
});

export default store;
