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
  }),
});

export const { useGetSettingsQuery, useUpdateSettingMutation } = settingsApi;
