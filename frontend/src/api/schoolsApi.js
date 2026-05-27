// api/schoolsApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const schoolsApi = createApi({
  reducerPath: 'schoolsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
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
      query: (newSchool) => ({
        url: '/schools',
        method: 'POST',
        body: newSchool,
      }),
      invalidatesTags: ['School'],
    }),
    updateSchool: builder.mutation({
      query: ({ id, ...updatedSchool }) => ({
        url: `/schools/${id}`,
        method: 'PUT',
        body: updatedSchool,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'School', id }],
    }),
    deleteSchool: builder.mutation({
      query: (id) => ({
        url: `/schools/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['School'],
    }),
  }),
});

export const {
  useGetSchoolsQuery,
  useGetSchoolByIdQuery,
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
  useDeleteSchoolMutation,
} = schoolsApi;
