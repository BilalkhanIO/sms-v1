import { api } from './api';

export const reportsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReportTypes: builder.query({
      query: () => '/reports/types',
      providesTags: ['ReportTypes'],
    }),
    generateReport: builder.mutation({
      query: ({ reportType, filters }) => ({
        url: `/reports/generate/${reportType}`,
        method: 'POST',
        body: filters,
      }),
    }),
  }),
});

export const { useGetReportTypesQuery, useGenerateReportMutation } = reportsApi;
