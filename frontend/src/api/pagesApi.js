import { api } from "./api";

export const pagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSuperAdminPages: builder.query({
      query: () => "/defaults/super-admin-pages",
      providesTags: ["Pages"],
    }),
  }),
});

export const { useGetSuperAdminPagesQuery } = pagesApi;
