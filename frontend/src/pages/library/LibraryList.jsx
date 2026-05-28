import React, { useState } from 'react';
import { BookOpen, PlusCircle, BookMarked, RotateCcw, Trash2, Search } from 'lucide-react';
import {
  useGetBooksQuery,
  useCreateBookMutation,
  useDeleteBookMutation,
  useIssueBookMutation,
  useReturnBookMutation,
} from '../../api/libraryApi';
import useAuth from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useUIStore } from '../../store/zustand/useUIStore';

const INITIAL_BOOK_FORM = {
  title: '',
  author: '',
  isbn: '',
  category: '',
  publisher: '',
  publishYear: '',
  totalCopies: '',
  location: '',
};

const INITIAL_ISSUE_FORM = {
  borrowerId: '',
  dueDate: '',
};

const LibraryList = () => {
  const { can } = useAuth();
  const addToast = useUIStore((s) => s.addToast);
  const openConfirm = useUIStore((s) => s.openConfirm);

  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [bookForm, setBookForm] = useState(INITIAL_BOOK_FORM);

  const [issueOpen, setIssueOpen] = useState(false);
  const [issueTarget, setIssueTarget] = useState(null); // book object
  const [issueForm, setIssueForm] = useState(INITIAL_ISSUE_FORM);

  const { data, isLoading, isError, error } = useGetBooksQuery(
    search ? { search } : undefined
  );
  const books = data?.data || data || [];

  const [createBook, { isLoading: isCreating }] = useCreateBookMutation();
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();
  const [issueBook, { isLoading: isIssuing }] = useIssueBookMutation();
  const [returnBook, { isLoading: isReturning }] = useReturnBookMutation();

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await createBook({
        ...bookForm,
        publishYear: bookForm.publishYear ? Number(bookForm.publishYear) : undefined,
        totalCopies: bookForm.totalCopies ? Number(bookForm.totalCopies) : undefined,
      }).unwrap();
      addToast({ type: 'success', title: 'Book added to library' });
      setAddOpen(false);
      setBookForm(INITIAL_BOOK_FORM);
    } catch (err) {
      addToast({ type: 'error', title: 'Failed to add book', message: err?.data?.message });
    }
  };

  const handleDelete = (book) => {
    openConfirm({
      title: 'Remove Book',
      message: `Are you sure you want to remove "${book.title}" from the library?`,
      danger: true,
      onConfirm: async () => {
        try {
          await deleteBook(book._id).unwrap();
          addToast({ type: 'success', title: 'Book removed' });
        } catch (err) {
          addToast({ type: 'error', title: 'Delete failed', message: err?.data?.message });
        }
      },
    });
  };

  const openIssueModal = (book) => {
    setIssueTarget(book);
    setIssueForm(INITIAL_ISSUE_FORM);
    setIssueOpen(true);
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      await issueBook({
        bookId: issueTarget._id,
        borrowerId: issueForm.borrowerId,
        dueDate: issueForm.dueDate,
      }).unwrap();
      addToast({ type: 'success', title: 'Book issued successfully' });
      setIssueOpen(false);
      setIssueTarget(null);
    } catch (err) {
      addToast({ type: 'error', title: 'Issue failed', message: err?.data?.message });
    }
  };

  const handleReturn = (book) => {
    openConfirm({
      title: 'Return Book',
      message: `Mark "${book.title}" as returned?`,
      danger: false,
      onConfirm: async () => {
        try {
          await returnBook({ bookId: book._id, issueId: book.currentIssueId || book.issueId }).unwrap();
          addToast({ type: 'success', title: 'Book returned successfully' });
        } catch (err) {
          addToast({ type: 'error', title: 'Return failed', message: err?.data?.message });
        }
      },
    });
  };

  const getBookStatus = (book) => {
    if (book.status) return book.status;
    const available = book.availableCopies ?? (book.totalCopies - (book.issuedCopies || 0));
    return available > 0 ? 'AVAILABLE' : 'OUT_OF_STOCK';
  };

  const columns = [
    {
      key: 'title',
      header: 'Title',
      className: 'font-medium text-gray-900',
      render: (b) => (
        <div>
          <p className="font-medium text-gray-900">{b.title}</p>
          {b.author && <p className="text-xs text-gray-400 mt-0.5">{b.author}</p>}
        </div>
      ),
    },
    {
      key: 'isbn',
      header: 'ISBN',
      className: 'text-gray-500 font-mono text-xs',
      render: (b) => b.isbn || '—',
    },
    {
      key: 'category',
      header: 'Category',
      className: 'text-gray-500',
      render: (b) => b.category || '—',
    },
    {
      key: 'copies',
      header: 'Copies',
      className: 'text-gray-500 text-center',
      headerClassName: 'text-center',
      render: (b) => {
        const total = b.totalCopies ?? '—';
        const available = b.availableCopies ?? '—';
        return (
          <span className="text-sm">
            <span className="font-medium text-gray-800">{available}</span>
            <span className="text-gray-400"> / {total}</span>
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (b) => <StatusBadge status={getBookStatus(b)} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (b) => {
        const isAvailable = (b.availableCopies ?? 1) > 0;
        const hasCurrentIssue = !!(b.currentIssueId || b.issueId || b.isCurrentlyIssued);
        return (
          <div className="flex items-center justify-end gap-2">
            {can('library', 'issue') && isAvailable && (
              <Button
                size="small"
                variant="secondary"
                onClick={() => openIssueModal(b)}
                title="Issue Book"
              >
                <BookMarked className="h-4 w-4 mr-1" />
                Issue
              </Button>
            )}
            {can('library', 'return') && hasCurrentIssue && (
              <Button
                size="small"
                variant="secondary"
                onClick={() => handleReturn(b)}
                disabled={isReturning}
                title="Return Book"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Return
              </Button>
            )}
            {can('library', 'delete') && (
              <button
                onClick={() => handleDelete(b)}
                disabled={isDeleting}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                title="Remove Book"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Library"
        action={
          can('library', 'create') && (
            <Button onClick={() => setAddOpen(true)} size="small">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Add Book
            </Button>
          )
        }
      />

      {/* Search bar */}
      <div className="mb-4 relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search books…"
          className="block w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <DataTable
        columns={columns}
        data={books}
        keyField="_id"
        isLoading={isLoading}
        error={isError ? error : null}
        emptyMessage="No books found."
        emptyIcon={<BookOpen className="h-12 w-12 opacity-30" />}
      />

      {/* Add Book Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => { setAddOpen(false); setBookForm(INITIAL_BOOK_FORM); }}
        title="Add Book"
        size="xl"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => { setAddOpen(false); setBookForm(INITIAL_BOOK_FORM); }}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" form="add-book-form" isLoading={isCreating}>
              Add Book
            </Button>
          </>
        }
      >
        <form id="add-book-form" onSubmit={handleAddBook} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                required
                value={bookForm.title}
                onChange={(e) => setBookForm((f) => ({ ...f, title: e.target.value }))}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Book title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
              <input
                type="text"
                required
                value={bookForm.author}
                onChange={(e) => setBookForm((f) => ({ ...f, author: e.target.value }))}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Author name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
              <input
                type="text"
                value={bookForm.isbn}
                onChange={(e) => setBookForm((f) => ({ ...f, isbn: e.target.value }))}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. 978-3-16-148410-0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={bookForm.category}
                onChange={(e) => setBookForm((f) => ({ ...f, category: e.target.value }))}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. Science, Math"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
              <input
                type="text"
                value={bookForm.publisher}
                onChange={(e) => setBookForm((f) => ({ ...f, publisher: e.target.value }))}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Publisher name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Publish Year</label>
              <input
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                value={bookForm.publishYear}
                onChange={(e) => setBookForm((f) => ({ ...f, publishYear: e.target.value }))}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. 2020"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Copies *</label>
              <input
                type="number"
                required
                min="1"
                value={bookForm.totalCopies}
                onChange={(e) => setBookForm((f) => ({ ...f, totalCopies: e.target.value }))}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. 5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location / Shelf</label>
              <input
                type="text"
                value={bookForm.location}
                onChange={(e) => setBookForm((f) => ({ ...f, location: e.target.value }))}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. A1, Shelf 3"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Issue Book Modal */}
      <Modal
        isOpen={issueOpen}
        onClose={() => { setIssueOpen(false); setIssueTarget(null); }}
        title={`Issue Book${issueTarget ? `: ${issueTarget.title}` : ''}`}
        size="default"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => { setIssueOpen(false); setIssueTarget(null); }}
              disabled={isIssuing}
            >
              Cancel
            </Button>
            <Button type="submit" form="issue-book-form" isLoading={isIssuing}>
              Issue Book
            </Button>
          </>
        }
      >
        <form id="issue-book-form" onSubmit={handleIssue} className="space-y-4">
          <p className="text-sm text-gray-500">
            Enter the borrower's ID and set a due date for this book.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Borrower ID (Student / Staff) *
            </label>
            <input
              type="text"
              required
              value={issueForm.borrowerId}
              onChange={(e) => setIssueForm((f) => ({ ...f, borrowerId: e.target.value }))}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter borrower ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={issueForm.dueDate}
              onChange={(e) => setIssueForm((f) => ({ ...f, dueDate: e.target.value }))}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LibraryList;
