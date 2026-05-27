import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Eye, Edit, Trash2, ClipboardList } from 'lucide-react';
import { useGetExamsQuery, useDeleteExamMutation } from '../../api/examApi';
import useAuth from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { useUIStore } from '../../store/zustand/useUIStore';

const ExamList = () => {
  const navigate = useNavigate();
  const { can } = useAuth();
  const openConfirm = useUIStore((s) => s.openConfirm);
  const addToast = useUIStore((s) => s.addToast);

  const { data: exams, isLoading, isError, error } = useGetExamsQuery();
  const [deleteExam, { isLoading: isDeleting }] = useDeleteExamMutation();

  const examList = exams?.data || exams || [];

  const handleDelete = (exam) => {
    openConfirm({
      title: 'Delete Exam',
      message: `Are you sure you want to delete "${exam.title}"?`,
      danger: true,
      onConfirm: async () => {
        try {
          await deleteExam(exam._id).unwrap();
          addToast({ type: 'success', title: 'Exam deleted' });
        } catch (err) {
          addToast({ type: 'error', title: 'Delete failed', message: err.data?.message });
        }
      },
    });
  };

  const columns = [
    {
      key: 'title',
      header: 'Title',
      className: 'font-medium text-gray-900',
      render: (e) => e.title,
    },
    {
      key: 'type',
      header: 'Type',
      className: 'text-gray-500',
      render: (e) => e.type,
    },
    {
      key: 'date',
      header: 'Date',
      className: 'text-gray-500',
      render: (e) => e.date ? new Date(e.date).toLocaleDateString() : '—',
    },
    {
      key: 'totalMarks',
      header: 'Total Marks',
      className: 'text-gray-500',
      render: (e) => e.totalMarks ?? '—',
    },
    {
      key: 'status',
      header: 'Status',
      render: (e) => <StatusBadge status={e.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (e) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/dashboard/exams/${e._id}`}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Link>
          {can('exams', 'edit') && (
            <Link
              to={`/dashboard/exams/${e._id}/edit`}
              className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Link>
          )}
          {can('exams', 'delete') && (
            <button
              onClick={() => handleDelete(e)}
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
        title="Exams"
        action={
          can('exams', 'create') && (
            <Button onClick={() => navigate('/dashboard/exams/create')} size="small">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Create Exam
            </Button>
          )
        }
      />

      <DataTable
        columns={columns}
        data={examList}
        keyField="_id"
        isLoading={isLoading}
        error={isError ? error : null}
        emptyMessage="No exams found."
        emptyIcon={<ClipboardList className="h-12 w-12 opacity-30" />}
      />
    </div>
  );
};

export default ExamList;
