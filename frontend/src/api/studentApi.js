// src/api/studentApi.js
import { api } from './api';

export const studentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => '/students',
      providesTags: ['Students'],
    }),
    getStudentById: builder.query({
      query: (id) => `/students/${id}`,
      providesTags: (result, error, id) => [{ type: 'Students', id }],
    }),
    getStudentsByClass: builder.query({
      query: (classId) => `/students/class/${classId}`,
      providesTags: ['Students'],
    }),
    createStudent: builder.mutation({
      query: (data) => ({
        url: '/students',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Students'],
    }),
    updateStudent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/students/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Students',
        { type: 'Students', id },
      ],
    }),
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `/students/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Students'],
    }),
    updateAttendance: builder.mutation({
      query: ({ studentId, date, status }) => ({
        url: `/students/${studentId}/attendance`,
        method: 'POST',
        body: { date, status },
      }),
      invalidatesTags: (result, error, { studentId }) => [
        'Students',
        { type: 'Students', id: studentId },
      ],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useGetStudentsByClassQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useUpdateAttendanceMutation,
} = studentApi;

// Add other student-related API calls