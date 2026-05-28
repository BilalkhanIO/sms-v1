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
    "DashboardStats",
    "SchoolAdmins",
    "Pages",
    "Transport",
    "Leave",
    "Messages",
    "Notifications",
    "AcademicYears",
    "Assignments",
    "Library",
    "Timetables",
    "School",
    "Schools",
    "Settings",
    "Backups",
    "Activities",
    "AuditLog",
  ],
});

export default api;
