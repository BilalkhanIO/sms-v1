import { api } from "./api";

export const backupsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBackups: builder.query({
      query: () => "backups",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Backup", id })),
              { type: "Backup", id: "LIST" },
            ]
          : [{ type: "Backup", id: "LIST" }],
    }),
    createBackup: builder.mutation({
      query: (newBackup) => ({
        url: "backups",
        method: "POST",
        body: newBackup,
      }),
      invalidatesTags: [{ type: "Backup", id: "LIST" }],
    }),
    deleteBackup: builder.mutation({
      query: (id) => ({
        url: `backups/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Backup", id }],
    }),
    restoreBackup: builder.mutation({
      query: (id) => ({
        url: `backups/${id}/restore`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetBackupsQuery,
  useCreateBackupMutation,
  useDeleteBackupMutation,
  useRestoreBackupMutation,
} = backupsApi;
