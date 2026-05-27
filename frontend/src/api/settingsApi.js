import { api } from "./api";

export const settingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => "settings",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Setting", id })),
              { type: "Setting", id: "LIST" },
            ]
          : [{ type: "Setting", id: "LIST" }],
    }),
    updateSetting: builder.mutation({
      query: ({ settingName, ...rest }) => ({
        url: `settings/${settingName}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: (result, error, { settingName }) => [
        { type: "Setting", id: settingName },
      ],
    }),
    updateSettingByName: builder.mutation({
      query: ({ settingName, ...rest }) => ({
        url: `settings/${settingName}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: (result, error, { settingName }) => [
        { type: "Setting", id: settingName },
        { type: "Setting", id: "LIST" },
      ],
    }),
    createSetting: builder.mutation({
      query: (body) => ({
        url: "settings",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Setting", id: "LIST" }],
    }),
    deleteSettingByName: builder.mutation({
      query: (settingName) => ({
        url: `settings/${settingName}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, settingName) => [
        { type: "Setting", id: settingName },
        { type: "Setting", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateSettingMutation,
  useUpdateSettingByNameMutation,
  useCreateSettingMutation,
  useDeleteSettingByNameMutation,
} = settingsApi;
