// api/activityApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const activityApi = createApi({
  reducerPath: 'activityApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getActivities: builder.query({
      query: (params) => ({
        url: '/activity-logs',
        params,
      }),
    }),
  }),
});

export const { useGetActivitiesQuery } = activityApi;
