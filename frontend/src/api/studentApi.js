// src/api/studentApi.js
import { api } from './api';

export const studentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => ({
        url: '/students',
        params: {
          populate: 'class,parentInfo.guardian.user'
        }
      }),
      providesTags: ['Students'],
    }),
    getStudentById: builder.query({
      query: (id) => ({
        url: `/students/${id}`,
        params: {
          populate: 'class,parentInfo.guardian.user'
        }
      }),
      providesTags: (result, error, id) => [{ type: 'Students', id }],
    }),
    getStudentsByClass: builder.query({
      query: (classId) => ({
        url: `/students/class/${classId}`,
        params: {
          populate: 'parentInfo.guardian.user'
        }
      }),
      providesTags: ['Students'],
    }),
    createStudent: builder.mutation({
      query: (data) => ({
        url: '/students',
        method: 'POST',
        body: data,
        formData: true,
      }),
      invalidatesTags: ['Students'],
    }),
    updateStudent: builder.mutation({
      query: ({ id, data }) => ({
        url: `/students/${id}`,
        method: 'PUT',
        body: data,
        formData: true,
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
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useGetStudentsByClassQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentApi;