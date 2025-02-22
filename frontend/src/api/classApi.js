// frontend/src/api/classApi.js
import { api } from "./api";

export const classApiSlice = api.injectEndpoints({
    endpoints: builder => ({
        getClasses: builder.query({
            query: () => '/classes',
            providesTags: (result, error, arg) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Class', id })), 'Class']
                    : ['Class'],
        }),
        // ... other class endpoints if needed (getClass, createClass, etc.) ...
    }),
});

export const {
    useGetClassesQuery,
    // ... other class hooks
} = classApiSlice;