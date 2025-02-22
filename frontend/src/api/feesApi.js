import { api } from './api';

export const feesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFees: builder.query({
      query: (params) => ({
        url: '/fees',
        params,
      }),
      providesTags: ['Fees'],
    }),
    getFeeById: builder.query({
      query: (id) => `/fees/${id}`,
      providesTags: (result, error, id) => [{ type: 'Fees', id }],
    }),
    getFeesByStudent: builder.query({
      query: (studentId) => `/fees/student/${studentId}`,
      providesTags: ['Fees'],
    }),
    getFeesByClass: builder.query({
      query: (classId) => `/fees/class/${classId}`,
      providesTags: ['Fees'],
    }),
    createFee: builder.mutation({
      query: (data) => ({
        url: '/fees',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Fees'],
    }),
    updateFee: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/fees/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Fees',
        { type: 'Fees', id },
      ],
    }),
    deleteFee: builder.mutation({
      query: (id) => ({
        url: `/fees/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Fees'],
    }),
    recordPayment: builder.mutation({
      query: (data) => ({
        url: '/fees/payment',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Fees'],
    }),
    getPaymentHistory: builder.query({
      query: (studentId) => `/fees/payment-history/${studentId}`,
      providesTags: ['Fees'],
    }),
    generateInvoice: builder.mutation({
      query: (feeId) => ({
        url: `/fees/${feeId}/invoice`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetFeesQuery,
  useGetFeeByIdQuery,
  useGetFeesByStudentQuery,
  useGetFeesByClassQuery,
  useCreateFeeMutation,
  useUpdateFeeMutation,
  useDeleteFeeMutation,
  useRecordPaymentMutation,
  useGetPaymentHistoryQuery,
  useGenerateInvoiceMutation,
} = feesApi; 