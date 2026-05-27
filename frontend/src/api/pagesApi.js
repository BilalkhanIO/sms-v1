import { api } from "./api";

export const pagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSuperAdminPages: builder.query({
      query: () => "/pages",
      providesTags: ["Pages"],
    }),
    createSuperAdminPage: builder.mutation({
      query: (data) => ({
        url: "/pages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Pages"],
    }),
    updateSuperAdminPage: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pages/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Pages",
        { type: "Pages", id },
      ],
    }),
    deleteSuperAdminPage: builder.mutation({
      query: (id) => ({
        url: `/pages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pages"],
    }),
  }),
});

export const {
  useGetSuperAdminPagesQuery,
  useCreateSuperAdminPageMutation,
  useUpdateSuperAdminPageMutation,
  useDeleteSuperAdminPageMutation,
} = pagesApi;
