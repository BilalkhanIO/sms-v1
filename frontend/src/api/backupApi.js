import { api } from './api';

export const backupApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBackups: builder.query({
      query: () => '/backups',
      providesTags: ['Backups'],
    }),
    createBackup: builder.mutation({
      query: (type) => ({
        url: '/backups',
        method: 'POST',
        body: { type },
      }),
      invalidatesTags: ['Backups'],
    }),
    restoreBackup: builder.mutation({
      query: (id) => ({
        url: `/backups/${id}/restore`,
        method: 'POST',
      }),
    }),
    deleteBackup: builder.mutation({
      query: (id) => ({
        url: `/backups/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Backups'],
    }),
    getBackupSettings: builder.query({
      query: () => '/settings/backup',
      providesTags: ['BackupSettings'],
    }),
    updateBackupSettings: builder.mutation({
      query: (settings) => ({
        url: '/settings/backup',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['BackupSettings'],
    }),
  }),
});

export const {
  useGetBackupsQuery,
  useCreateBackupMutation,
  useRestoreBackupMutation,
  useDeleteBackupMutation,
  useGetBackupSettingsQuery,
  useUpdateBackupSettingsMutation,
} = backupApi;
