import { api } from './api';

export const transportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRoutes: builder.query({
      query: () => '/transport/routes',
      providesTags: ['Transport'],
    }),
    getRouteById: builder.query({
      query: (id) => `/transport/routes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Transport', id }],
    }),
    createRoute: builder.mutation({
      query: (data) => ({
        url: '/transport/routes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Transport'],
    }),
    updateRoute: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/transport/routes/${id}`,
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
        url: `/transport/routes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Transport'],
    }),
    assignStudent: builder.mutation({
      query: ({ routeId, studentId }) => ({
        url: `/transport/routes/${routeId}/students`,
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
        url: `/transport/routes/${routeId}/students/${studentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { routeId }) => [
        'Transport',
        { type: 'Transport', id: routeId },
      ],
    }),
    getStudentRoute: builder.query({
      query: (studentId) => `/transport/students/${studentId}/route`,
      providesTags: ['Transport'],
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
  useGetStudentRouteQuery,
} = transportApi;
