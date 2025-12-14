import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { api } from "../api/api";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  devTools: import.meta.env.DEV,
});

setupListeners(store.dispatch);

export default store;
