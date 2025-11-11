// src/api/teacherApi.js
import { api } from './api';

export const teacherApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTeachers: builder.query({
      query: () => '/teachers',
      providesTags: ['Teachers'],
    }),
    getTeacherById: builder.query({
      query: (id) => `/teachers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Teachers', id }],
    }),
    createTeacher: builder.mutation({
      query: (data) => ({
        url: '/teachers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Teachers'],
    }),
    updateTeacher: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/teachers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Teachers',
        { type: 'Teachers', id },
      ],
    }),
    deleteTeacher: builder.mutation({
      query: (id) => ({
        url: `/teachers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Teachers'],
    }),
    assignTeacherToClass: builder.mutation({
      query: ({ teacherId, classId }) => ({
        url: `/teachers/${teacherId}/assign-class`,
        method: 'PUT',
        body: { classId },
      }),
      invalidatesTags: ['Teachers', 'Classes'],
    }),
    assignSubjectToTeacher: builder.mutation({
      query: ({ teacherId, subjectId, classId }) => ({
        url: `/teachers/${teacherId}/assign-subject`,
        method: 'PUT',
        body: { subjectId, classId },
      }),
      invalidatesTags: ['Teachers', 'Subjects', 'Classes'],
    }),
    unassignSubjectFromTeacher: builder.mutation({
      query: ({ teacherId, subjectId, classId }) => ({
        url: `/teachers/${teacherId}/unassign-subject`,
        method: 'PUT',
        body: { subjectId, classId },
      }),
      invalidatesTags: ['Teachers', 'Subjects', 'Classes'],
    }),
  }),
});

export const {
  useGetTeachersQuery,
  useGetTeacherByIdQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
  useAssignTeacherToClassMutation,
  useAssignSubjectToTeacherMutation,
  useUnassignSubjectFromTeacherMutation,
} = teacherApi;

