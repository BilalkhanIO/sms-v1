import { api } from './api';

export const auditLogsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query({
      query: (params) => ({
        url: '/audit-logs',
        params,
      }),
      providesTags: (result, error, arg) =>
        result
          ? [...(result?.data?.map(({ _id }) => ({ type: 'AuditLog', id: _id })) || []), { type: 'AuditLog', id: 'LIST' }]
          : [{ type: 'AuditLog', id: 'LIST' }],
    }),
  }),
});

export const { useGetAuditLogsQuery } = auditLogsApi;
