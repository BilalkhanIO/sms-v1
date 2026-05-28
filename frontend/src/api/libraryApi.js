import { api } from './api';

export const libraryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: (params) => ({
        url: '/library/books',
        params,
      }),
      providesTags: ['Library'],
    }),
    getBookById: builder.query({
      query: (id) => `/library/books/${id}`,
      providesTags: (result, error, id) => [{ type: 'Library', id }],
    }),
    createBook: builder.mutation({
      query: (data) => ({
        url: '/library/books',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Library'],
    }),
    updateBook: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/library/books/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Library',
        { type: 'Library', id },
      ],
    }),
    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/library/books/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Library'],
    }),
    issueBook: builder.mutation({
      query: ({ bookId, borrowerId, dueDate }) => ({
        url: `/library/books/${bookId}/issue`,
        method: 'POST',
        body: { borrowerId, dueDate },
      }),
      invalidatesTags: (result, error, { bookId }) => [
        'Library',
        { type: 'Library', id: bookId },
      ],
    }),
    returnBook: builder.mutation({
      query: ({ bookId, issueId }) => ({
        url: `/library/books/${bookId}/return/${issueId}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, { bookId }) => [
        'Library',
        { type: 'Library', id: bookId },
      ],
    }),
    getMyBorrowedBooks: builder.query({
      query: () => '/library/my-books',
      providesTags: ['Library'],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookByIdQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useIssueBookMutation,
  useReturnBookMutation,
  useGetMyBorrowedBooksQuery,
} = libraryApi;
