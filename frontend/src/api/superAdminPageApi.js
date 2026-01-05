import { api } from "./api";

export const superAdminPageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSuperAdminPages: builder.query({
      query: () => "/super-admin-pages",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "SuperAdminPage", id })),
              { type: "SuperAdminPage", id: "LIST" },
            ]
          : [{ type: "SuperAdminPage", id: "LIST" }],
    }),
    getSuperAdminPageById: builder.query({
      query: (id) => `/super-admin-pages/${id}`,
      providesTags: (result, error, id) => [{ type: "SuperAdminPage", id }],
    }),
    createSuperAdminPage: builder.mutation({
      query: (newPage) => ({
        url: "/super-admin-pages",
        method: "POST",
        body: newPage,
      }),
      invalidatesTags: [{ type: "SuperAdminPage", id: "LIST" }],
    }),
    updateSuperAdminPage: builder.mutation({
      query: ({ id, ...updatedPage }) => ({
        url: `/super-admin-pages/${id}`,
        method: "PUT",
        body: updatedPage,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "SuperAdminPage", id },
        { type: "SuperAdminPage", id: "LIST" },
      ],
    }),
    deleteSuperAdminPage: builder.mutation({
      query: (id) => ({
        url: `/super-admin-pages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "SuperAdminPage", id },
        { type: "SuperAdminPage", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetSuperAdminPagesQuery,
  useGetSuperAdminPageByIdQuery,
  useCreateSuperAdminPageMutation,
  useUpdateSuperAdminPageMutation,
  useDeleteSuperAdminPageMutation,
} = superAdminPageApi;
