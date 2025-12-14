import { api } from "./api";

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: (timeRange) => `dashboard/stats?timeRange=${timeRange}`,
      providesTags: ["Dashboard"],
    }),
    getSchoolStats: builder.query({
      query: () => "dashboard/school-stats",
      providesTags: ["Dashboard"],
    }),
    getAdminDashboardStats: builder.query({
      query: (timeRange) => `dashboard/admin-stats?timeRange=${timeRange}`,
      providesTags: ["Dashboard"],
    }),
    getParentDashboardStats: builder.query({
      query: (id) => `dashboard/parent-stats/${id}`,
      providesTags: ["Dashboard"],
    }),
    getTeacherDashboardStats: builder.query({
      query: (id) => `dashboard/teacher-stats/${id}`,
      providesTags: ["Dashboard"],
    }),
    getStudentDashboardStats: builder.query({
      query: (id) => `dashboard/student-stats/${id}`,
      providesTags: ["Dashboard"],
    }),
    getUserRoleDistribution: builder.query({
      query: () => "dashboard/user-role-distribution",
      providesTags: ["Dashboard"],
    }),
    getUserStatusDistribution: builder.query({
      query: () => "dashboard/user-status-distribution",
      providesTags: ["Dashboard"],
    }),
    getSchoolStatusDistribution: builder.query({
      query: () => "dashboard/school-status-distribution",
      providesTags: ["Dashboard"],
    }),
    getUserRegistrationTrends: builder.query({
      query: () => "dashboard/user-registration-trends",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const useGetDashboardStatsQuery = dashboardApi.useGetDashboardStatsQuery;
export const useGetSchoolStatsQuery = dashboardApi.useGetSchoolStatsQuery;
export const useGetAdminDashboardStatsQuery = dashboardApi.useGetAdminDashboardStatsQuery;
export const useGetParentDashboardStatsQuery = dashboardApi.useGetParentDashboardStatsQuery;
export const useGetTeacherDashboardStatsQuery = dashboardApi.useGetTeacherDashboardStatsQuery;
export const useGetStudentDashboardStatsQuery = dashboardApi.useGetStudentDashboardStatsQuery;
export const useGetUserRoleDistributionQuery = dashboardApi.useGetUserRoleDistributionQuery;
export const useGetUserStatusDistributionQuery = dashboardApi.useGetUserStatusDistributionQuery;
export const useGetSchoolStatusDistributionQuery = dashboardApi.useGetSchoolStatusDistributionQuery;
export const useGetUserRegistrationTrendsQuery = dashboardApi.useGetUserRegistrationTrendsQuery;
