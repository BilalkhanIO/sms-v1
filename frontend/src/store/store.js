import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "../api/api";
import { activityApi } from "../api/activityApi";

// Redux is kept only for RTK Query server-state caching.
// Global client state (auth, UI) lives in Zustand stores.
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [activityApi.reducerPath]: activityApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, activityApi.middleware),
  devTools: import.meta.env.DEV,
});

setupListeners(store.dispatch);

export default store;
