import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Eye, Trash2, ClipboardList } from 'lucide-react';
import {
  useGetAssignmentsQuery,
  useGetMyAssignmentsQuery,
  useCreateAssignmentMutation,
  useDeleteAssignmentMutation,
} from '../../api/assignmentApi';
import { useGetClassesQuery } from '../../api/classesApi';
import { useGetSubjectsQuery } from '../../api/subjectApi';
import useAuth from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useUIStore } from '../../store/zustand/useUIStore';

const INITIAL_FORM = {
  title: '',
  description: '',
  subject: '',
  class: '',
  dueDate: '',
  pointsPossible: '',
};

const AssignmentList = () => {
  const { user, can } = useAuth();
  const role = user?.role;
  const openConfirm = useUIStore((s) => s.openConfirm);
  const addToast = useUIStore((s) => s.addToast);

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  // Admin and teacher see all; student sees their own
  const isStudent = role === 'STUDENT';
  const isTeacher = role === 'TEACHER';
  const isAdmin = role === 'SCHOOL_ADMIN';

  const { data: allData, isLoading: allLoading, isError: allError, error: allErr } =
    useGetAssignmentsQuery(undefined, { skip: isStudent });

  const { data: myData, isLoading: myLoading, isError: myError, error: myErr } =
    useGetMyAssignmentsQuery(undefined, { skip: !isStudent });

  const { data: classesData } = useGetClassesQuery(undefined, { skip: !isAdmin && !isTeacher });
  const classes = classesData?.data || classesData || [];

  const { data: subjectsData } = useGetSubjectsQuery(undefined, { skip: !isAdmin && !isTeacher });
  const subjects = subjectsData?.data || subjectsData || [];

  const [createAssignment, { isLoading: isCreating }] = useCreateAssignmentMutation();
  const [deleteAssignment, { isLoading: isDeleting }] = useDeleteAssignmentMutation();

  const rawList = isStudent
    ? myData?.data || myData || []
    : allData?.data || allData || [];

  const isLoading = isStudent ? myLoading : allLoading;
  const isError = isStudent ? myError : allError;
  const error = isStudent ? myErr : allErr;

  // For student: group by status
  const now = new Date();
  const pending = isStudent
    ? rawList.filter((a) => a.submissionStatus === 'PENDING')
    : [];
  const submitted = isStudent ? rawList.filter((a) => a.submissionStatus === 'SUBMITTED') : [];
  const overdue = isStudent
    ? rawList.filter((a) => a.submissionStatus === 'OVERDUE')
    : [];

  const handleDelete = (assignment) => {
    openConfirm({
      title: 'Delete Assignment',
      message: `Are you sure you want to delete "${assignment.title}"?`,
      danger: true,
      onConfirm: async () => {
        try {
          await deleteAssignment(assignment._id).unwrap();
          addToast({ type: 'success', title: 'Assignment deleted' });
        } catch (err) {
          addToast({ type: 'error', title: 'Delete failed', message: err?.data?.message });
        }
      },
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createAssignment({
        ...form,
        pointsPossible: form.pointsPossible ? Number(form.pointsPossible) : undefined,
      }).unwrap();
      addToast({ type: 'success', title: 'Assignment created' });
      setCreateOpen(false);
      setForm(INITIAL_FORM);
    } catch (err) {
      addToast({ type: 'error', title: 'Create failed', message: err?.data?.message });
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Title',
      className: 'font-medium text-gray-900',
      render: (a) => (
        <Link to={`/dashboard/assignments/${a._id}`} className="hover:text-blue-600">
          {a.title}
        </Link>
      ),
    },
    {
      key: 'subject',
      header: 'Subject',
      className: 'text-gray-500',
      render: (a) => a.subject?.name || a.subjectName || '—',
    },
    {
      key: 'class',
      header: 'Class',
      className: 'text-gray-500',
      render: (a) => a.class?.name || a.className || '—',
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      className: 'text-gray-500',
      render: (a) => a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '—',
    },
    ...(isTeacher
      ? [
          {
            key: 'submissions',
            header: 'Submissions',
            className: 'text-gray-500',
            render: (a) => {
              const count = a.submissionCount ?? a.submissions?.length ?? '—';
              return count;
            },
          },
        ]
      : []),
    {
      key: 'status',
      header: 'Status',
      render: (a) => <StatusBadge status={a.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (a) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/dashboard/assignments/${a._id}`}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Link>
          {can('assignments', 'delete') && (
            <button
              onClick={() => handleDelete(a)}
              disabled={isDeleting}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const renderStudentGroup = (label, list, emptyText) => (
    <div className="mb-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">{label}</h2>
      <DataTable
        columns={columns}
        data={list}
        keyField="_id"
        isLoading={false}
        emptyMessage={emptyText}
        emptyIcon={<ClipboardList className="h-8 w-8 opacity-30" />}
      />
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Assignments"
        action={
          isTeacher && (
            <Button onClick={() => setCreateOpen(true)} size="small">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Create Assignment
            </Button>
          )
        }
      />

      {isStudent ? (
        isLoading ? (
          <div className="flex justify-center py-16">
            <span className="text-gray-400 text-sm">Loading…</span>
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {error?.data?.message || 'Failed to load assignments.'}
          </div>
        ) : (
          <>
            {renderStudentGroup('Pending', pending, 'No pending assignments.')}
            {renderStudentGroup('Submitted', submitted, 'No submitted assignments.')}
            {renderStudentGroup('Overdue', overdue, 'No overdue assignments.')}
          </>
        )
      ) : (
        <DataTable
          columns={columns}
          data={rawList}
          keyField="_id"
          isLoading={isLoading}
          error={isError ? error : null}
          emptyMessage="No assignments found."
          emptyIcon={<ClipboardList className="h-12 w-12 opacity-30" />}
        />
      )}

      {/* Create Assignment Modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => { setCreateOpen(false); setForm(INITIAL_FORM); }}
        title="Create Assignment"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => { setCreateOpen(false); setForm(INITIAL_FORM); }}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="create-assignment-form"
              isLoading={isCreating}
            >
              Create
            </Button>
          </>
        }
      >
        <form id="create-assignment-form" onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Assignment title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Assignment description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">— Select subject —</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                value={form.class}
                onChange={(e) => setForm((f) => ({ ...f, class: e.target.value }))}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">— Select class —</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
              <input
                type="datetime-local"
                required
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Points Possible</label>
              <input
                type="number"
                min="0"
                value={form.pointsPossible}
                onChange={(e) => setForm((f) => ({ ...f, pointsPossible: e.target.value }))}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. 100"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AssignmentList;
