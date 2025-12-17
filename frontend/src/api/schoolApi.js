import { api } from './api';

export const schoolApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSchools: builder.query({
      query: () => 'schools',
      providesTags: ['School'],
    }),
    getSchoolById: builder.query({
      query: (id) => `schools/${id}`,
      providesTags: (result, error, id) => [{ type: 'School', id }],
    }),
    createSchool: builder.mutation({
      query: (school) => ({
        url: 'schools',
        method: 'POST',
        body: school,
      }),
      invalidatesTags: ['School'],
    }),
    updateSchool: builder.mutation({
      query: ({ id, ...school }) => ({
        url: `schools/${id}`,
        method: 'PUT',
        body: school,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'School', id }],
    }),
    deleteSchool: builder.mutation({
      query: (id) => ({
        url: `schools/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['School'],
    }),
    assignSchoolAdmin: builder.mutation({
      query: ({ schoolId, userId }) => ({
        url: `schools/${schoolId}/assign-admin`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: (result, error, { schoolId }) => [{ type: 'School', id: schoolId }],
    }),
  }),
});

export const {
  useGetSchoolsQuery,
  useGetSchoolByIdQuery,
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
  useDeleteSchoolMutation,
  useAssignSchoolAdminMutation,
} = schoolApi;
