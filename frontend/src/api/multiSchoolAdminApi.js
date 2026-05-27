import { api } from "./api";

export const multiSchoolAdminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getManagedSchools: builder.query({
      query: () => "multi-school-admin/schools",
      providesTags: ["ManagedSchools"],
    }),
    getSchoolAdmins: builder.query({
      query: () => "multi-school-admin/admins",
      providesTags: ["SchoolAdmins"],
    }),
    assignSchoolAdmin: builder.mutation({
      query: (data) => ({
        url: "multi-school-admin/assign-admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ManagedSchools", "SchoolAdmins"],
    }),
    unassignSchoolAdmin: builder.mutation({
      query: (data) => ({
        url: "multi-school-admin/unassign-admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ManagedSchools", "SchoolAdmins"],
    }),
  }),
});

export const {
  useGetManagedSchoolsQuery,
  useGetSchoolAdminsQuery,
  useAssignSchoolAdminMutation,
  useUnassignSchoolAdminMutation,
} = multiSchoolAdminApi;
