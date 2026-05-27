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
    getAllManagedUsers: builder.query({
      query: () => 'multi-school-admin/users',
      providesTags: ['ManagedUsers'],
    }),
    getMultiSchoolAdmins: builder.query({
      query: () => 'multi-school-admin/admins',
      providesTags: ['MultiSchoolAdmins'],
    }),
    assignMultiSchoolAdmin: builder.mutation({
      query: (email) => ({
        url: 'multi-school-admin/admins',
        method: 'POST',
        body: { email },
      }),
      invalidatesTags: ['MultiSchoolAdmins'],
    }),
    removeMultiSchoolAdmin: builder.mutation({
      query: (adminId) => ({
        url: `multi-school-admin/admins/${adminId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MultiSchoolAdmins'],
    }),
    getManagedSchools: builder.query({
      query: () => 'multi-school-admin/schools',
      providesTags: ['ManagedSchools'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetSchoolAdminsQuery,
  useAssignSchoolAdminMutation,
  useRemoveSchoolAdminMutation,
  useGetAllManagedUsersQuery,
  useGetMultiSchoolAdminsQuery,
  useAssignMultiSchoolAdminMutation,
  useRemoveMultiSchoolAdminMutation,
  useGetManagedSchoolsQuery,
} = multiSchoolAdminApi;
