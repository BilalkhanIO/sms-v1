import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { PlusCircle, Eye, Edit, Trash2, Building2 } from 'lucide-react';
import { useGetSchoolsQuery, useDeleteSchoolMutation } from '../../api/schoolApi';
import { useAuthStore } from '../../store/zustand/useAuthStore';
import useAuth from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import { useUIStore } from '../../store/zustand/useUIStore';

const SchoolList = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { can } = useAuth();
  const openConfirm = useUIStore((s) => s.openConfirm);
  const addToast = useUIStore((s) => s.addToast);

  const isSchoolAdmin = user?.role === 'SCHOOL_ADMIN' && user?.school;
  const { data, isLoading, isError, error } = useGetSchoolsQuery(undefined, { skip: isSchoolAdmin });
  const [deleteSchool, { isLoading: isDeleting }] = useDeleteSchoolMutation();

  // SCHOOL_ADMIN sees only their own school
  if (isSchoolAdmin) {
    return <Navigate to={`/dashboard/schools/${user.school}`} replace />;
  }

  const schools = data?.data || data || [];

  const handleDelete = (school) => {
    openConfirm({
      title: 'Delete School',
      message: `Are you sure you want to delete "${school.name}"? This will also delete the associated admin user.`,
      danger: true,
      onConfirm: async () => {
        try {
          await deleteSchool(school._id).unwrap();
          addToast({ type: 'success', title: 'School deleted' });
        } catch (err) {
          addToast({ type: 'error', title: 'Delete failed', message: err.data?.message });
        }
      },
    });
  };

  const columns = [
    {
      key: 'name',
      header: 'School Name',
      className: 'font-medium text-gray-900',
      render: (s) => s.name,
    },
    {
      key: 'email',
      header: 'Email',
      className: 'text-gray-500',
      render: (s) => s.email || '—',
    },
    {
      key: 'phone',
      header: 'Phone',
      className: 'text-gray-500',
      render: (s) => s.phone || '—',
    },
    {
      key: 'address',
      header: 'Address',
      className: 'text-gray-500',
      render: (s) => s.address ? `${s.address.city || ''} ${s.address.country || ''}`.trim() || '—' : '—',
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (s) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/dashboard/schools/${s._id}`}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Link>
          {can('schools', 'edit') && (
            <Link
              to={`/dashboard/schools/${s._id}/edit`}
              className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Link>
          )}
          {can('schools', 'delete') && (
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
        title="Schools"
        action={
          can('schools', 'create') && (
            <Button onClick={() => navigate('/dashboard/schools/create')} size="small">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Add School
            </Button>
          )
        }
      />

      <DataTable
        columns={columns}
        data={schools}
        keyField="_id"
        isLoading={isLoading}
        error={isError ? error : null}
        emptyMessage="No schools found."
        emptyIcon={<Building2 className="h-12 w-12 opacity-30" />}
      />
    </div>
  );
};

export default SchoolList;
