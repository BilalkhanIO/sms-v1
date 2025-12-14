import { api } from './api';

export const classesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query({
      query: () => '/classes',
      providesTags: ['Classes'],
    }),
    getClassById: builder.query({
      query: (id) => `/classes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Classes', id }],
    }),
    createClass: builder.mutation({
      query: (data) => ({
        url: '/classes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Classes'],
    }),
    updateClass: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/classes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Classes', id }],
    }),
    deleteClass: builder.mutation({
      query: (id) => ({
        url: `/classes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Classes'],
    }),
  }),
});

export const useGetClassesQuery = classesApi.useGetClassesQuery;
export const useGetClassByIdQuery = classesApi.useGetClassByIdQuery;
export const useCreateClassMutation = classesApi.useCreateClassMutation;
export const useUpdateClassMutation = classesApi.useUpdateClassMutation;
export const useDeleteClassMutation = classesApi.useDeleteClassMutation;