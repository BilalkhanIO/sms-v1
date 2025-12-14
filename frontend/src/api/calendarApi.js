import { api } from './api';

export const calendarApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: (params = {}) => ({
        url: '/calendar/events',
        params: {
          start: params.start,
          end: params.end,
          type: params.type,
          visibility: params.visibility,
        },
      }),
      providesTags: ['Calendar'],
    }),
    getEventById: builder.query({
      query: (id) => `/calendar/events/${id}`,
      providesTags: (result, error, id) => [{ type: 'Calendar', id }],
    }),
    createEvent: builder.mutation({
      query: (data) => ({
        url: '/calendar/events',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Calendar'],
    }),
    updateEvent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/calendar/events/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Calendar', id }, 'Calendar'],
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/calendar/events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Calendar'],
    }),
    getUpcomingEvents: builder.query({
      query: (limit = 5) => ({
        url: '/calendar/events/upcoming',
        params: { limit },
      }),
      providesTags: ['Calendar'],
    }),
    getEventsByType: builder.query({
      query: (type) => ({
        url: '/calendar/events/type',
        params: { type },
      }),
      providesTags: ['Calendar'],
    }),
    getEventsByDateRange: builder.query({
      query: ({ startDate, endDate }) => ({
        url: '/calendar/events/range',
        params: { startDate, endDate },
      }),
      providesTags: ['Calendar'],
    }),
    getParticipants: builder.query({
      query: (eventId) => `/calendar/events/${eventId}/participants`,
      providesTags: (result, error, id) => [{ type: 'Calendar', id }],
    }),
    updateParticipants: builder.mutation({
      query: ({ eventId, participants }) => ({
        url: `/calendar/events/${eventId}/participants`,
        method: 'PUT',
        body: { participants },
      }),
      invalidatesTags: (result, error, { eventId }) => [{ type: 'Calendar', eventId }, 'Calendar'],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetUpcomingEventsQuery,
  useGetEventsByTypeQuery,
  useGetEventsByDateRangeQuery,
  useGetParticipantsQuery,
  useUpdateParticipantsMutation,
} = calendarApi;