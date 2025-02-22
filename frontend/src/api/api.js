import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Create the base API with shared configuration
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    'Auth',
    'Users',
    'Teachers',
    'Students',
    'Classes',
    'Calendar',
    'Attendance',
    'Subjects',
    'Fees',
    'Exams',
    'Dashboard'
  ],
}); 