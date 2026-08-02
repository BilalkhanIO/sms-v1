import { api } from './api';

export const academicYearApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAcademicYears: builder.query({
      query: () => '/academic-years',
      providesTags: ['AcademicYears'],
    }),
    getAcademicYearById: builder.query({
      query: (id) => `/academic-years/${id}`,
      providesTags: (result, error, id) => [{ type: 'AcademicYears', id }],
    }),
    getActiveYear: builder.query({
      query: () => '/academic-years/active',
      providesTags: ['AcademicYears'],
    }),
    createAcademicYear: builder.mutation({
      query: (data) => ({ url: '/academic-years', method: 'POST', body: data }),
      invalidatesTags: ['AcademicYears'],
    }),
    updateAcademicYear: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/academic-years/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (result, error, { id }) => ['AcademicYears', { type: 'AcademicYears', id }],
    }),
    deleteAcademicYear: builder.mutation({
      query: (id) => ({ url: `/academic-years/${id}`, method: 'DELETE' }),
      invalidatesTags: ['AcademicYears'],
    }),
    setActiveYear: builder.mutation({
      query: (id) => ({ url: `/academic-years/${id}/set-active`, method: 'PATCH' }),
      invalidatesTags: ['AcademicYears'],
    }),
  }),
});

export const {
  useGetAcademicYearsQuery,
  useGetAcademicYearByIdQuery,
  useGetActiveYearQuery,
  useCreateAcademicYearMutation,
  useUpdateAcademicYearMutation,
  useDeleteAcademicYearMutation,
  useSetActiveYearMutation,
} = academicYearApi;
