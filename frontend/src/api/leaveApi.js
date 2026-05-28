import { api } from './api';

export const leaveApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLeaveRequests: builder.query({
      query: (params) => ({
        url: '/leaves',
        params,
      }),
      providesTags: ['Leave'],
    }),
    getLeaveById: builder.query({
      query: (id) => `/leaves/${id}`,
      providesTags: (result, error, id) => [{ type: 'Leave', id }],
    }),
    createLeaveRequest: builder.mutation({
      query: (data) => ({
        url: '/leaves',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Leave'],
    }),
    updateLeaveRequest: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/leaves/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Leave',
        { type: 'Leave', id },
      ],
    }),
    deleteLeaveRequest: builder.mutation({
      query: (id) => ({
        url: `/leaves/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Leave'],
    }),
  }),
});

export const {
  useGetLeaveRequestsQuery,
  useGetLeaveByIdQuery,
  useCreateLeaveRequestMutation,
  useUpdateLeaveRequestMutation,
  useDeleteLeaveRequestMutation,
} = leaveApi;
