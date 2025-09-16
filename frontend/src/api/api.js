import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
    prepareHeaders: (headers) => {
      // Ensure cookies are sent; set JSON headers consistently
      if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "Auth",
    "Users",
    "Teachers",
    "Students",
    "Classes",
    "Calendar",
    "Attendance",
    "Subjects",
    "Fees",
    "Exams",
    "Dashboard",
  ],
});

export default api;
