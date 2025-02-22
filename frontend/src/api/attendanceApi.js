import { api } from './api';

export const attendanceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAttendance: builder.query({
      query: ({ classId, date, status } = {}) => {
        const params = new URLSearchParams();
        if (classId) params.append('classId', classId);
        if (date) params.append('date', date);
        if (status) params.append('status', status);
        return {
          url: `/attendance?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Attendance'],
    }),

    getAttendanceById: builder.query({
      query: (id) => ({
        url: `/attendance/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Attendance', id }],
    }),

    markAttendance: builder.mutation({
      query: (data) => ({
        url: '/attendance',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),

    updateAttendance: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/attendance/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Attendance',
        { type: 'Attendance', id },
      ],
    }),

    deleteAttendance: builder.mutation({
      query: (id) => ({
        url: `/attendance/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Attendance'],
    }),

    getStudentAttendance: builder.query({
      query: ({ studentId, startDate, endDate } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        return {
          url: `/attendance/student/${studentId}?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: (result, error, { studentId }) => [
        { type: 'Attendance', id: `student-${studentId}` },
      ],
    }),

    getClassAttendance: builder.query({
      query: ({ classId, startDate, endDate } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        return {
          url: `/attendance/class/${classId}?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: (result, error, { classId }) => [
        { type: 'Attendance', id: `class-${classId}` },
      ],
    }),

    getAttendanceStats: builder.query({
      query: ({ classId, studentId, startDate, endDate } = {}) => {
        const params = new URLSearchParams();
        if (classId) params.append('classId', classId);
        if (studentId) params.append('studentId', studentId);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        return {
          url: `/attendance/stats?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['AttendanceStats'],
    }),
  }),
});

export const {
  useGetAttendanceQuery,
  useGetAttendanceByIdQuery,
  useMarkAttendanceMutation,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
  useGetStudentAttendanceQuery,
  useGetClassAttendanceQuery,
  useGetAttendanceStatsQuery,
} = attendanceApi; 