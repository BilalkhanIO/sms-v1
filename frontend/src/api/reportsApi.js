import { api } from "./api";

export const reportsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query({
      query: () => "reports",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Report", id })),
              { type: "Report", id: "LIST" },
            ]
          : [{ type: "Report", id: "LIST" }],
    }),
    generateReport: builder.mutation({
      query: (newReport) => ({
        url: "reports",
        method: "POST",
        body: newReport,
      }),
      invalidatesTags: [{ type: "Report", id: "LIST" }],
    }),
    deleteReport: builder.mutation({
      query: (id) => ({
        url: `reports/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Report", id }],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useGenerateReportMutation,
  useDeleteReportMutation,
} = reportsApi;
