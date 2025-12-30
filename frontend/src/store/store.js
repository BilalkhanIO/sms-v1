import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { api } from "../api/api";
import { activityApi } from "../api/activityApi";
import { schoolsApi } from "../api/schoolsApi";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
    [activityApi.reducerPath]: activityApi.reducer,
    [schoolsApi.reducerPath]: schoolsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, activityApi.middleware, schoolsApi.middleware),
  devTools: import.meta.env.DEV,
});

setupListeners(store.dispatch);

export default store;
