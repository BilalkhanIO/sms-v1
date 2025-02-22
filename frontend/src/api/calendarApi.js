import { api } from './api';

export const calendarApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: (params) => ({
        url: '/calendar',
        params,
      }),
      providesTags: ['Calendar'],
    }),
    getEventById: builder.query({
      query: (id) => `/calendar/${id}`,
      providesTags: (result, error, id) => [{ type: 'Calendar', id }],
    }),
    createEvent: builder.mutation({
      query: (data) => ({
        url: '/calendar',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Calendar'],
    }),
    updateEvent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/calendar/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Calendar',
        { type: 'Calendar', id },
      ],
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/calendar/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Calendar'],
    }),
    getEventsByDate: builder.query({
      query: ({ startDate, endDate }) => ({
        url: '/calendar/range',
        params: { startDate, endDate },
      }),
      providesTags: ['Calendar'],
    }),
    getEventsByType: builder.query({
      query: (type) => `/calendar/type/${type}`,
      providesTags: ['Calendar'],
    }),
    getUpcomingEvents: builder.query({
      query: (limit = 5) => ({
        url: '/calendar/upcoming',
        params: { limit },
      }),
      providesTags: ['Calendar'],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetEventsByDateQuery,
  useGetEventsByTypeQuery,
  useGetUpcomingEventsQuery,
} = calendarApi; 