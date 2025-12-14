import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const schoolsApi = createApi({
  reducerPath: 'schoolsApi',
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
  tagTypes: ['School'],
  endpoints: (builder) => ({
    getSchools: builder.query({
      query: () => '/schools',
      providesTags: ['School'],
    }),
    getSchoolById: builder.query({
      query: (id) => `/schools/${id}`,
      providesTags: (result, error, id) => [{ type: 'School', id }],
    }),
    createSchool: builder.mutation({
      query: (data) => ({
        url: '/schools',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['School'],
    }),
    updateSchool: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/schools/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'School', id },
        'School',
      ],
    }),
    deleteSchool: builder.mutation({
      query: (id) => ({
        url: `/schools/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['School'],
    }),
    getSchoolStats: builder.query({
      query: (id) => `/schools/${id}/stats`,
      providesTags: (result, error, id) => [{ type: 'School', id }],
    }),
  }),
});

export const {
  useGetSchoolsQuery,
  useGetSchoolByIdQuery,
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
  useDeleteSchoolMutation,
  useGetSchoolStatsQuery,
} = schoolsApi;