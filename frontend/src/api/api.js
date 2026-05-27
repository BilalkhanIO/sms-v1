import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
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
    "Pages",
  ],
});

export default api;
