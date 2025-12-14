import React from 'react';
import { Link } from 'react-router-dom';
import { useGetUsersQuery, useDeleteUserMutation } from '../../api/usersApi';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/authSlice';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import ErrorMessage from '../../components/common/ErrorMessage';
import UserDataGrid from '../../components/users/UserDataGrid';

const UserList = () => {
  const { data: users, isLoading, isError, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id).unwrap();
      } catch (err) {
        console.error('Failed to delete user:', err);
        alert(`Failed to delete user: ${err.data?.message || err.error}`);
      }
    }
  };

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (isError) {
    return (
      <ErrorMessage>
        Error: {error.data?.message || error.error || 'Failed to load users'}
      </ErrorMessage>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="Users">
        <Link to="/dashboard/users/create">
          <Button>Add User</Button>
        </Link>
      </PageHeader>

      <UserDataGrid users={users?.data || []} handleDelete={handleDelete} />
    </div>
  );
};

export default UserList;
