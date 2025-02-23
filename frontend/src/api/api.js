import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Create the base API with shared configuration
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
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