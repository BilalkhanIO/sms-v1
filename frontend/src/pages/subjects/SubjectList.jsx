import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Eye, Edit, Trash2, BookOpen } from 'lucide-react';
import { useGetSubjectsQuery, useDeleteSubjectMutation } from '../../api/subjectApi';
import useAuth from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import { useUIStore } from '../../store/zustand/useUIStore';

const SubjectList = () => {
  const navigate = useNavigate();
  const { can } = useAuth();
  const openConfirm = useUIStore((s) => s.openConfirm);
  const addToast = useUIStore((s) => s.addToast);

  const { data, isLoading, isError, error } = useGetSubjectsQuery();
  const [deleteSubject, { isLoading: isDeleting }] = useDeleteSubjectMutation();

  const subjects = data?.data || data || [];

  const handleDelete = (subject) => {
    openConfirm({
      title: 'Delete Subject',
      message: `Are you sure you want to delete "${subject.name}"?`,
      danger: true,
      onConfirm: async () => {
        try {
          await deleteSubject(subject._id).unwrap();
          addToast({ type: 'success', title: 'Subject deleted' });
        } catch (err) {
          addToast({ type: 'error', title: 'Delete failed', message: err.data?.message });
        }
      },
    });
  };

  const columns = [
    {
      key: 'name',
      header: 'Subject',
      className: 'font-medium text-gray-900',
      render: (s) => (
        <div>
          <p>{s.name}</p>
          {s.description && (
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
              {s.description.length > 60 ? `${s.description.slice(0, 60)}…` : s.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'code',
      header: 'Code',
      className: 'text-gray-500',
      render: (s) => s.code || '—',
    },
    {
      key: 'grade',
      header: 'Grade',
      className: 'text-gray-500',
      render: (s) => s.grade ? `Grade ${s.grade}` : '—',
    },
    {
      key: 'credits',
      header: 'Credits',
      className: 'text-gray-500',
      render: (s) => s.credits ?? '—',
    },
    {
      key: 'teachers',
      header: 'Teachers',
      className: 'text-gray-500',
      render: (s) => s.assignedTeachers?.length
        ? s.assignedTeachers.map((t) => `${t.user?.firstName ?? ''} ${t.user?.lastName ?? ''}`.trim()).join(', ')
        : 'None',
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (s) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/dashboard/subjects/${s._id}`}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Link>
          {can('subjects', 'edit') && (
            <Link
              to={`/dashboard/subjects/${s._id}/edit`}
              className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Link>
          )}
          {can('subjects', 'delete') && (
            <button
              onClick={() => handleDelete(s)}
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

  return (
    <div>
      <PageHeader
        title="Subjects"
        action={
          can('subjects', 'create') && (
            <Button onClick={() => navigate('/dashboard/subjects/create')} size="small">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Add Subject
            </Button>
          )
        }
      />

      <DataTable
        columns={columns}
        data={subjects}
        keyField="_id"
        isLoading={isLoading}
        error={isError ? error : null}
        emptyMessage="No subjects found."
        emptyIcon={<BookOpen className="h-12 w-12 opacity-30" />}
      />
    </div>
  );
};

export default SubjectList;
