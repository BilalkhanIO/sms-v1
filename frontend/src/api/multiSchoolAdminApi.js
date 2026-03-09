import { api } from './api';

export const multiSchoolAdminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => 'multi-school-admin/dashboard-stats',
      providesTags: ['DashboardStats'],
    }),
    getSchoolAdmins: builder.query({
      query: (schoolId) => `multi-school-admin/${schoolId}/admins`,
      providesTags: (result, error, schoolId) => [{ type: 'SchoolAdmins', id: schoolId }],
    }),
    getAllSchoolAdmins: builder.query({
      query: () => 'multi-school-admin/admins',
      providesTags: ['SchoolAdmins'],
    }),
    assignSchoolAdmin: builder.mutation({
      query: ({ schoolId, email }) => ({
        url: `multi-school-admin/${schoolId}/admins`,
        method: 'POST',
        body: { email },
      }),
      invalidatesTags: (result, error, { schoolId }) => [{ type: 'SchoolAdmins', id: schoolId }],
    }),
    removeSchoolAdmin: builder.mutation({
      query: ({ schoolId, adminId }) => ({
        url: `multi-school-admin/${schoolId}/admins/${adminId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { schoolId }) => [{ type: 'SchoolAdmins', id: schoolId }],
    }),
    createSchoolAdmin: builder.mutation({
      query: (admin) => ({
        url: 'multi-school-admin/admins',
        method: 'POST',
        body: admin,
      }),
      invalidatesTags: ['SchoolAdmins'],
    }),
    updateSchoolAdmin: builder.mutation({
      query: ({ adminId, ...admin }) => ({
        url: `multi-school-admin/admins/${adminId}`,
        method: 'PUT',
        body: admin,
      }),
      invalidatesTags: ['SchoolAdmins'],
    }),
    deleteSchoolAdmin: builder.mutation({
      query: (adminId) => ({
        url: `multi-school-admin/admins/${adminId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SchoolAdmins'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetSchoolAdminsQuery,
  useGetAllSchoolAdminsQuery,
  useAssignSchoolAdminMutation,
  useRemoveSchoolAdminMutation,
  useCreateSchoolAdminMutation,
  useUpdateSchoolAdminMutation,
  useDeleteSchoolAdminMutation,
} = multiSchoolAdminApi;
