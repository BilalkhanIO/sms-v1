import { api } from './api';

export const activityLogsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getActivityLogs: builder.query({
      query: (params) => ({
        url: '/activities', // Backend route is /api/activities
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          type: params?.type,
          startDate: params?.startDate, // Use startDate
          endDate: params?.endDate,     // Use endDate
          severity: params?.severity,
          context: params?.context,
        },
      }),
      providesTags: ['Activities'], // Use 'Activities' tag type from base API
    }),
    getActivityLogById: builder.query({
      query: (id) => `/activities/${id}`, // Backend route is /api/activities/:id
      providesTags: (result, error, id) => [{ type: 'Activities', id }],
    }),
    exportActivityLogs: builder.query({
      query: (params) => ({
        url: '/activities/export', // Assuming a backend export route for activities
        params,
        responseHandler: (response) => response.blob(),
      }),
      providesTags: ['Activities'],
    }),
  }),
});

export const {
  useGetActivityLogsQuery,
  useGetActivityLogByIdQuery,
  useLazyExportActivityLogsQuery,
} = activityLogsApi;