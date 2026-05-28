import { api } from './api';

export const transportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRoutes: builder.query({
      query: () => '/transport',
      providesTags: ['Transport'],
    }),
    getRouteById: builder.query({
      query: (id) => `/transport/${id}`,
      providesTags: (result, error, id) => [{ type: 'Transport', id }],
    }),
    createRoute: builder.mutation({
      query: (data) => ({
        url: '/transport',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Transport'],
    }),
    updateRoute: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/transport/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Transport',
        { type: 'Transport', id },
      ],
    }),
    deleteRoute: builder.mutation({
      query: (id) => ({
        url: `/transport/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Transport'],
    }),
    assignStudent: builder.mutation({
      query: ({ routeId, studentId }) => ({
        url: `/transport/${routeId}/assign`,
        method: 'POST',
        body: { studentId },
      }),
      invalidatesTags: (result, error, { routeId }) => [
        'Transport',
        { type: 'Transport', id: routeId },
      ],
    }),
    removeStudent: builder.mutation({
      query: ({ routeId, studentId }) => ({
        url: `/transport/${routeId}/remove`,
        method: 'POST',
        body: { studentId },
      }),
      invalidatesTags: (result, error, { routeId }) => [
        'Transport',
        { type: 'Transport', id: routeId },
      ],
    }),
  }),
});

export const {
  useGetRoutesQuery,
  useGetRouteByIdQuery,
  useCreateRouteMutation,
  useUpdateRouteMutation,
  useDeleteRouteMutation,
  useAssignStudentMutation,
  useRemoveStudentMutation,
} = transportApi;
