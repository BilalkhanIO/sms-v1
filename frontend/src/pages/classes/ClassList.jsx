import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Eye, Edit, Trash2, School } from 'lucide-react';
import { useGetClassesQuery, useDeleteClassMutation } from '../../api/classesApi';
import useAuth from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import { useUIStore } from '../../store/zustand/useUIStore';

const ClassList = () => {
  const navigate = useNavigate();
  const { can } = useAuth();
  const openConfirm = useUIStore((s) => s.openConfirm);
  const addToast = useUIStore((s) => s.addToast);

  const { data, isLoading, isError, error } = useGetClassesQuery();
  const [deleteClass, { isLoading: isDeleting }] = useDeleteClassMutation();

  const classes = data?.data || data || [];

  const handleDelete = (cls) => {
    openConfirm({
      title: 'Delete Class',
      message: `Are you sure you want to delete "${cls.name} ${cls.section || ''}"?`,
      danger: true,
      onConfirm: async () => {
        try {
          await deleteClass(cls._id).unwrap();
          addToast({ type: 'success', title: 'Class deleted' });
        } catch (err) {
          addToast({ type: 'error', title: 'Delete failed', message: err.data?.message });
        }
      },
    });
  };

  const columns = [
    {
      key: 'name',
      header: 'Class Name',
      className: 'font-medium text-gray-900',
      render: (c) => `${c.name} ${c.section || ''}`.trim(),
    },
    {
      key: 'academicYear',
      header: 'Academic Year',
      className: 'text-gray-500',
      render: (c) => c.academicYear || '—',
    },
    {
      key: 'teacher',
      header: 'Class Teacher',
      className: 'text-gray-500',
      render: (c) => c.classTeacher
        ? `${c.classTeacher.user?.firstName ?? ''} ${c.classTeacher.user?.lastName ?? ''}`.trim() || '—'
        : 'Not assigned',
    },
    {
      key: 'students',
      header: 'Students',
      className: 'text-gray-500',
      render: (c) => c.students?.length ?? 0,
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (c) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/dashboard/classes/${c._id}`}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Link>
          {can('classes', 'edit') && (
            <Link
              to={`/dashboard/classes/update/${c._id}`}
              className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Link>
          )}
          {can('classes', 'delete') && (
            <button
              onClick={() => handleDelete(c)}
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
        title="Classes"
        action={
          can('classes', 'create') && (
            <Button onClick={() => navigate('/dashboard/classes/create')} size="small">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Add Class
            </Button>
          )
        }
      />

      <DataTable
        columns={columns}
        data={classes}
        keyField="_id"
        isLoading={isLoading}
        error={isError ? error : null}
        emptyMessage="No classes found."
        emptyIcon={<School className="h-12 w-12 opacity-30" />}
      />
    </div>
  );
};

export default ClassList;
