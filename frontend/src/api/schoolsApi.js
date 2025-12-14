import { api } from './api';

export const schoolsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSchools: builder.query({
      query: () => '/schools',
      providesTags: ['Schools'],
    }),
    getSchoolById: builder.query({
      query: (id) => `/schools/${id}`,
      providesTags: (result, error, id) => [{ type: 'Schools', id }],
    }),
    createSchool: builder.mutation({
      query: (newSchool) => ({
        url: '/schools',
        method: 'POST',
        body: newSchool,
      }),
      invalidatesTags: ['Schools'],
    }),
    updateSchool: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/schools/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Schools', id }],
    }),
    deleteSchool: builder.mutation({
      query: (id) => ({
        url: `/schools/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Schools'],
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
