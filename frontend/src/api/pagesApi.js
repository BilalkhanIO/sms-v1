import { api } from "./api";

export const pagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSuperAdminPages: builder.query({
      query: () => "/defaults/super-admin-pages",
      providesTags: ["Pages"],
    }),
    getAvailableSuperAdminPages: builder.query({
        query: () => "/defaults/available-super-admin-pages",
        providesTags: ["Pages"],
    }),
  }),
});

export const { useGetSuperAdminPagesQuery, useGetAvailableSuperAdminPagesQuery } = pagesApi;
