import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Eye, Edit, Trash2, BookUser } from 'lucide-react';
import { useGetStudentsQuery, useDeleteStudentMutation } from '../../api/studentApi';
import useAuth from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import { useUIStore } from '../../store/zustand/useUIStore';

const StudentList = () => {
  const navigate = useNavigate();
  const { can } = useAuth();
  const openConfirm = useUIStore((s) => s.openConfirm);
  const addToast = useUIStore((s) => s.addToast);

  const { data, isLoading, isError, error } = useGetStudentsQuery();
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();

  const students = data?.data || data || [];

  const handleDelete = (student) => {
    const name = `${student.user?.firstName ?? ''} ${student.user?.lastName ?? ''}`.trim();
    openConfirm({
      title: 'Delete Student',
      message: `Are you sure you want to delete ${name || 'this student'}?`,
      danger: true,
      onConfirm: async () => {
        try {
          await deleteStudent(student._id).unwrap();
          addToast({ type: 'success', title: 'Student deleted' });
        } catch (err) {
          addToast({ type: 'error', title: 'Delete failed', message: err.data?.message });
        }
      },
    });
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      className: 'font-medium text-gray-900',
      render: (s) => `${s.user?.firstName ?? ''} ${s.user?.lastName ?? ''}`.trim() || '—',
    },
    {
      key: 'rollNumber',
      header: 'Roll No.',
      className: 'text-gray-500',
      render: (s) => s.rollNumber || '—',
    },
    {
      key: 'class',
      header: 'Class',
      className: 'text-gray-500',
      render: (s) => s.class ? `${s.class.name} ${s.class.section || ''}`.trim() : '—',
    },
    {
      key: 'email',
      header: 'Email',
      className: 'text-gray-500',
      render: (s) => s.user?.email || '—',
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (s) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/dashboard/students/${s._id}`}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </Link>
          {can('students', 'edit') && (
            <Link
              to={`/dashboard/students/update/${s._id}`}
              className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Link>
          )}
          {can('students', 'delete') && (
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
        title="Students"
        action={
          can('students', 'create') && (
            <Button onClick={() => navigate('/dashboard/students/create')} size="small">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Add Student
            </Button>
          )
        }
      />

      <DataTable
        columns={columns}
        data={students}
        keyField="_id"
        isLoading={isLoading}
        error={isError ? error : null}
        emptyMessage="No students found."
        emptyIcon={<BookUser className="h-12 w-12 opacity-30" />}
      />
    </div>
  );
};

export default StudentList;
