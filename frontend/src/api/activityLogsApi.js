import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const activityLogsApi = createApi({
  reducerPath: 'activityLogsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['ActivityLog'],
  endpoints: (builder) => ({
    getActivityLogs: builder.query({
      query: (params) => ({
        url: '/activity-logs',
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          type: params?.type,
          dateRange: params?.dateRange,
          search: params?.search,
        },
      }),
      providesTags: ['ActivityLog'],
    }),
    getActivityLogById: builder.query({
      query: (id) => `/activity-logs/${id}`,
      providesTags: (result, error, id) => [{ type: 'ActivityLog', id }],
    }),
    exportActivityLogs: builder.query({
      query: (params) => ({
        url: '/activity-logs/export',
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetActivityLogsQuery,
  useGetActivityLogByIdQuery,
  useLazyExportActivityLogsQuery,
} = activityLogsApi;