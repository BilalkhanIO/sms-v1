import { api } from './api';

export const assignmentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAssignments: builder.query({
      query: (params) => ({
        url: '/assignments',
        params,
      }),
      providesTags: ['Assignments'],
    }),
    getAssignmentById: builder.query({
      query: (id) => `/assignments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Assignments', id }],
    }),
    getMyAssignments: builder.query({
      query: () => '/assignments/my',
      providesTags: ['Assignments'],
    }),
    createAssignment: builder.mutation({
      query: (data) => ({
        url: '/assignments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Assignments'],
    }),
    updateAssignment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/assignments/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Assignments',
        { type: 'Assignments', id },
      ],
    }),
    deleteAssignment: builder.mutation({
      query: (id) => ({
        url: `/assignments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Assignments'],
    }),
    submitAssignment: builder.mutation({
      query: ({ id, fileUrl }) => ({
        url: `/assignments/${id}/submit`,
        method: 'POST',
        body: { fileUrl },
      }),
      invalidatesTags: (result, error, { id }) => [
        'Assignments',
        { type: 'Assignments', id },
      ],
    }),
    gradeSubmission: builder.mutation({
      query: ({ assignmentId, studentId, grade, feedback }) => ({
        url: `/assignments/${assignmentId}/grade/${studentId}`,
        method: 'PUT',
        body: { grade, feedback },
      }),
      invalidatesTags: (result, error, { assignmentId }) => [
        'Assignments',
        { type: 'Assignments', id: assignmentId },
      ],
    }),
  }),
});

export const {
  useGetAssignmentsQuery,
  useGetAssignmentByIdQuery,
  useGetMyAssignmentsQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
  useSubmitAssignmentMutation,
  useGradeSubmissionMutation,
} = assignmentApi;
