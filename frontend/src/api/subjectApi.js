import { api } from './api';

export const subjectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubjects: builder.query({
      query: (params) => ({
        url: '/subjects',
        params,
      }),
      providesTags: ['Subjects'],
    }),
    getSubjectById: builder.query({
      query: (id) => `/subjects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Subjects', id }],
    }),
    getSubjectsByClass: builder.query({
      query: (classId) => `/subjects/class/${classId}`,
      providesTags: ['Subjects'],
    }),
    getSubjectsByTeacher: builder.query({
      query: (teacherId) => `/subjects/teacher/${teacherId}`,
      providesTags: ['Subjects'],
    }),
    createSubject: builder.mutation({
      query: (data) => ({
        url: '/subjects',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subjects'],
    }),
    updateSubject: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/subjects/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Subjects',
        { type: 'Subjects', id },
      ],
    }),
    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `/subjects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subjects'],
    }),
    assignTeacher: builder.mutation({
      query: ({ subjectId, teacherId }) => ({
        url: `/subjects/${subjectId}/assign-teacher`,
        method: 'POST',
        body: { teacherId },
      }),
      invalidatesTags: (result, error, { subjectId }) => [
        'Subjects',
        { type: 'Subjects', id: subjectId },
        'Teachers',
      ],
    }),
  }),
});

export const {
  useGetSubjectsQuery,
  useGetSubjectByIdQuery,
  useGetSubjectsByClassQuery,
  useGetSubjectsByTeacherQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
  useAssignTeacherMutation,
} = subjectApi; 