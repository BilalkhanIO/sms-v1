import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
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
  tagTypes: ['Settings'],
  endpoints: (builder) => ({
    getSystemSettings: builder.query({
      query: () => '/settings/system',
      providesTags: ['Settings'],
    }),
    updateSystemSettings: builder.mutation({
      query: (data) => ({
        url: '/settings/system',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),
    getSecuritySettings: builder.query({
      query: () => '/settings/security',
      providesTags: ['Settings'],
    }),
    updateSecuritySettings: builder.mutation({
      query: (data) => ({
        url: '/settings/security',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  useGetSecuritySettingsQuery,
  useUpdateSecuritySettingsMutation,
} = settingsApi;