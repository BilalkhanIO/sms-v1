import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { useGetUsersQuery, useDeleteUserMutation } from '../../api/usersApi';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import PageHeader from '../../components/common/PageHeader';
import UserDataGrid from '../../components/users/UserDataGrid';
import Spinner from '../../components/common/Spinner';
import { useUIStore } from '../../store/zustand/useUIStore';

const UserList = () => {
  const navigate = useNavigate();
  const { can } = useAuth();
  const openConfirm = useUIStore((s) => s.openConfirm);
  const addToast = useUIStore((s) => s.addToast);

  const { data: users, isLoading, isError, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleDelete = (id) => {
    openConfirm({
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      danger: true,
      onConfirm: async () => {
        try {
          await deleteUser(id).unwrap();
          addToast({ type: 'success', title: 'User deleted' });
        } catch (err) {
          addToast({ type: 'error', title: 'Delete failed', message: err.data?.message });
        }
      },
    });
  };

  if (isLoading) return <Spinner />;
  if (isError) return <div className="text-red-500 p-4">{error?.data?.message || 'Failed to load users.'}</div>;

  return (
    <div>
      <PageHeader
        title="Users"
        action={
          can('users', 'create') && (
            <Button onClick={() => navigate('/dashboard/users/create')} size="small">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Add User
            </Button>
          )
        }
      />
      <UserDataGrid users={users?.data || []} handleDelete={handleDelete} />
    </div>
  );
};

export default UserList;
