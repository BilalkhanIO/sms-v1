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
  }),
});

export const {
  useGetTeachersQuery,
  useGetTeacherByIdQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = teacherApi;

export const assignTeacherToClass = async (teacherId, classId) => {
  const response = await API.put(`/teachers/${teacherId}/assign-class`, { classId });
  return response.data;
};

export const assignSubjectToTeacher = async (teacherId, subjectId) => {
  const response = await API.put(`/teachers/${teacherId}/assign-subject`, { subjectId });
  return response.data;
};
