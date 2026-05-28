import { api } from './api';

export const messageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: () => '/messages',
      providesTags: ['Messages'],
    }),
    getSentMessages: builder.query({
      query: () => '/messages/sent',
      providesTags: ['Messages'],
    }),
    getMessageById: builder.query({
      query: (id) => `/messages/${id}`,
      providesTags: (result, error, id) => [{ type: 'Messages', id }],
    }),
    sendMessage: builder.mutation({
      query: (data) => ({
        url: '/messages',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Messages'],
    }),
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/messages/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        'Messages',
        { type: 'Messages', id },
      ],
    }),
    deleteMessage: builder.mutation({
      query: (id) => ({
        url: `/messages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Messages'],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useGetSentMessagesQuery,
  useGetMessageByIdQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
  useDeleteMessageMutation,
} = messageApi;
