import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useAuthStore } from "../store/zustand/useAuthStore";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "include",
});

// Wrap baseQuery to silently refresh the access token on 401,
// then retry the original request once before giving up.
let isRefreshing = false;
let refreshPromise = null;

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // Deduplicate concurrent refresh attempts
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = baseQuery(
        { url: "/auth/refresh-token", method: "POST" },
        api,
        extraOptions
      ).finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
    }

    const refreshResult = await refreshPromise;

    if (refreshResult && !refreshResult.error) {
      // New access cookie is set by the server — retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed — clear session and let the app redirect to login
      useAuthStore.getState().clearUser();
    }
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
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
    "MultiSchoolAdmins",
    "SchoolDetails",
    "Pages",
    "Parents",
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
