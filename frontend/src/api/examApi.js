import { api } from './api';

export const examApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getExams: builder.query({
      query: (params) => ({
        url: '/exams',
        params,
      }),
      providesTags: ['Exams'],
    }),
    getExamById: builder.query({
      query: (id) => `/exams/${id}`,
      providesTags: (result, error, id) => [{ type: 'Exams', id }],
    }),
    getExamsByClass: builder.query({
      query: (classId) => `/exams/class/${classId}`,
      providesTags: ['Exams'],
    }),
    getExamsBySubject: builder.query({
      query: (subjectId) => `/exams/subject/${subjectId}`,
      providesTags: ['Exams'],
    }),
    createExam: builder.mutation({
      query: (data) => ({
        url: '/exams',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Exams'],
    }),
    updateExam: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/exams/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Exams',
        { type: 'Exams', id },
      ],
    }),
    deleteExam: builder.mutation({
      query: (id) => ({
        url: `/exams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Exams'],
    }),
    submitResults: builder.mutation({
      query: ({ examId, results }) => ({
        url: `/exams/${examId}/results`,
        method: 'POST',
        body: { results },
      }),
      invalidatesTags: (result, error, { examId }) => [
        'Exams',
        { type: 'Exams', id: examId },
      ],
    }),
    getStudentResults: builder.query({
      query: ({ examId, studentId }) => `/exams/${examId}/results/${studentId}`,
      providesTags: (result, error, { examId, studentId }) => [
        { type: 'Exams', id: examId },
        { type: 'Students', id: studentId },
      ],
    }),
    getClassResults: builder.query({
      query: (examId) => `/exams/${examId}/results`,
      providesTags: (result, error, examId) => [
        { type: 'Exams', id: examId },
      ],
    }),
    generateReportCard: builder.mutation({
      query: ({ studentId, examId }) => ({
        url: `/exams/report-card`,
        method: 'POST',
        body: { studentId, examId },
      }),
    }),
  }),
});

export const {
  useGetExamsQuery,
  useGetExamByIdQuery,
  useGetExamsByClassQuery,
  useGetExamsBySubjectQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useDeleteExamMutation,
  useSubmitResultsMutation,
  useGetStudentResultsQuery,
  useGetClassResultsQuery,
  useGenerateReportCardMutation,
} = examApi; 