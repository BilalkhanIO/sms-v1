import { api } from './api';

export const timetableApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTimetableByClass: builder.query({
      query: (classId) => `/timetables/class/${classId}`,
      providesTags: (result, error, classId) => [{ type: 'Timetables', id: classId }],
    }),
    getMyTimetable: builder.query({
      query: () => '/timetables/me',
      providesTags: ['Timetables'],
    }),
    createTimetable: builder.mutation({
      query: (data) => ({
        url: '/timetables',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Timetables'],
    }),
    updateTimetable: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/timetables/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Timetables',
        { type: 'Timetables', id },
      ],
    }),
    deleteTimetable: builder.mutation({
      query: (id) => ({
        url: `/timetables/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Timetables'],
    }),
  }),
});

export const {
  useGetTimetableByClassQuery,
  useGetMyTimetableQuery,
  useCreateTimetableMutation,
  useUpdateTimetableMutation,
  useDeleteTimetableMutation,
} = timetableApi;
