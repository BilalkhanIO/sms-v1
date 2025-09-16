import { api } from './api';

export const parentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getParents: builder.query({
      query: () => '/parents',
      providesTags: ['Parents'],
    }),
    getParentById: builder.query({
      query: (id) => `/parents/${id}`,
      providesTags: (result, error, id) => [{ type: 'Parents', id }],
    }),
    createParent: builder.mutation({
      query: (data) => ({
        url: '/parents',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Parents'],
    }),
    updateParent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/parents/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Parents',
        { type: 'Parents', id },
      ],
    }),
    deleteParent: builder.mutation({
      query: (id) => ({
        url: `/parents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Parents'],
    }),
  }),
});

export const {
  useGetParentsQuery,
  useGetParentByIdQuery,
  useCreateParentMutation,
  useUpdateParentMutation,
  useDeleteParentMutation,
} = parentApi;