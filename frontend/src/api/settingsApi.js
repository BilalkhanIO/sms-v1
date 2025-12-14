import { api } from './api';

export const settingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => '/settings',
      providesTags: ['Settings'],
    }),
    getSettingByName: builder.query({
      query: (settingName) => `/settings/${settingName}`,
      providesTags: (result, error, settingName) => [{ type: 'Settings', settingName }],
    }),
    createSetting: builder.mutation({
      query: (newSetting) => ({
        url: '/settings',
        method: 'POST',
        body: newSetting,
      }),
      invalidatesTags: ['Settings'],
    }),
    updateSettingByName: builder.mutation({
      query: ({ settingName, ...patch }) => ({
        url: `/settings/${settingName}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { settingName }) => [{ type: 'Settings', settingName }],
    }),
    deleteSettingByName: builder.mutation({
      query: (settingName) => ({
        url: `/settings/${settingName}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useGetSettingByNameQuery,
  useCreateSettingMutation,
  useUpdateSettingByNameMutation,
  useDeleteSettingByNameMutation,
} = settingsApi;
