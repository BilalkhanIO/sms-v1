import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Eye, Edit, Trash2, GraduationCap } from 'lucide-react';
import { useGetTeachersQuery, useDeleteTeacherMutation } from '../../api/teacherApi';
import useAuth from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { useUIStore } from '../../store/zustand/useUIStore';
import TeacherForm from '../../components/TeacherForm';

const TeacherList = () => {
  const { user, can } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState(null);
  const openConfirm = useUIStore((s) => s.openConfirm);
  const addToast = useUIStore((s) => s.addToast);

  const { data, isLoading, isError, error } = useGetTeachersQuery();
  const [deleteTeacher, { isLoading: isDeleting }] = useDeleteTeacherMutation();

  const teachers = data?.data || data || [];

  const handleCreate = () => {
    setEditTeacher(null);
    setModalOpen(true);
  };

  const handleEdit = (teacher) => {
    setEditTeacher(teacher);
    setModalOpen(true);
  };

  const handleDelete = (teacher) => {
    const teacherName = `${teacher.user?.firstName ?? ''} ${teacher.user?.lastName ?? ''}`.trim() || teacher.employeeId || 'this teacher';
    openConfirm({
      title: 'Delete Teacher',
      message: `Are you sure you want to delete ${teacherName}? This cannot be undone.`,
      danger: true,
      onConfirm: async () => {
        try {
          await deleteTeacher(teacher._id).unwrap();
          addToast({ type: 'success', title: 'Teacher deleted' });
        } catch (err) {
          addToast({ type: 'error', title: 'Delete failed', message: err.data?.message });
        }
      },
    });
  };

  const handleFormSuccess = () => {
    setModalOpen(false);
    addToast({
      type: 'success',
      title: editTeacher ? 'Teacher updated' : 'Teacher created',
    });
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      className: 'font-medium text-gray-900',
      render: (t) => `${t.user?.firstName ?? ''} ${t.user?.lastName ?? ''}`.trim() || '—',
    },
    {
      key: 'email',
      header: 'Email',
      className: 'text-gray-500',
      render: (t) => t.user?.email || '—',
    },
    {
      key: 'employeeId',
      header: 'Employee ID',
      className: 'text-gray-500',
      render: (t) => t.employeeId || '—',
    },
    {
      key: 'specialization',
      header: 'Specialization',
      className: 'text-gray-500',
      render: (t) => t.specialization || '—',
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (t) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/dashboard/teachers/${t._id}`}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </Link>
          {can('teachers', 'edit') && (
            <button
              onClick={() => handleEdit(t)}
              className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          {can('teachers', 'delete') && (
            <button
              onClick={() => handleDelete(t)}
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
        title="Teachers"
        action={
          can('teachers', 'create') && (
            <Button onClick={handleCreate} size="small">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Add Teacher
            </Button>
          )
        }
      />

      <DataTable
        columns={columns}
        data={teachers}
        keyField="_id"
        isLoading={isLoading}
        error={isError ? error : null}
        emptyMessage="No teachers found."
        emptyIcon={<GraduationCap className="h-12 w-12 opacity-30" />}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTeacher ? 'Edit Teacher' : 'Add Teacher'}
        size="xl"
      >
        <TeacherForm
          teacher={editTeacher}
          onSuccess={handleFormSuccess}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default TeacherList;
