import { api } from "./api";
import { setCredentials, clearCredentials, setError } from "../store/authSlice";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.data.data));
          console.log(`this from useauth ${data.data.data.role}`);
        } catch (err) {
          dispatch(setError(err.data?.message || "Login failed"));
          console.error("Login failed:", err);
        }
      },
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(api.util.resetApiState());
          dispatch(clearCredentials());
        } catch (err) {
          dispatch(setError(err.data?.message || "Logout failed"));
          console.error("Logout failed:", err);
        }
      },
      invalidatesTags: ["Auth"],
    }),
    // refreshToken: builder.mutation({
    //   query: () => ({
    //     url: "/auth/refresh-token",
    //     method: "POST",
    //   }),
    // }),
    // forgotPassword: builder.mutation({
    //   query: (email) => ({
    //     url: "/auth/forgot-password",
    //     method: "POST",
    //     body: { email },
    //   }),
    // }),
    // resetPassword: builder.mutation({
    //   query: ({ token, password }) => ({
    //     url: "/auth/reset-password",
    //     method: "POST",
    //     body: { token, password },
    //   }),
    // }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
