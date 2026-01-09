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
    getManagedUsers: builder.query({
      query: () => 'multi-school-admin/users',
      providesTags: ['ManagedUsers'],
    }),
    createManagedUser: builder.mutation({
      query: (newUser) => ({
        url: 'multi-school-admin/users',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['ManagedUsers'],
    }),
    updateManagedUser: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `multi-school-admin/users/${id}`,
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: ['ManagedUsers'],
    }),
    deleteManagedUser: builder.mutation({
      query: (id) => ({
        url: `multi-school-admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ManagedUsers'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetSchoolAdminsQuery,
  useAssignSchoolAdminMutation,
  useRemoveSchoolAdminMutation,
  useGetManagedUsersQuery,
  useCreateManagedUserMutation,
  useUpdateManagedUserMutation,
  useDeleteManagedUserMutation,
} = multiSchoolAdminApi;
