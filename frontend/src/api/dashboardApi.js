import { api } from "./api";

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/dashboard",
      providesTags: ["Dashboard"],
      transformResponse: (response) => response, // raw data used by dashboards
      transformErrorResponse: (response) => ({
        status: response.status,
        message: response.data?.message || "Failed to load dashboard data",
      }),
      keepUnusedDataFor: 60, // Cache for 1 minute
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
