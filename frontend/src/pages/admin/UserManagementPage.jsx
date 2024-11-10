import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../redux/features/userSlice';
import UserTable from '../../components/admin/UserTable';
import UserFilters from '../../components/admin/UserFilters';
import UserCreateForm from '../../components/user/UserCreateForm';
import UserEditForm from '../../components/user/UserEditForm';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const UserManagementPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    search: '',
  });

  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create User
          </button>
        </div>

        <UserFilters filters={filters} setFilters={setFilters} />

        <div className="mt-4">
          <UserTable
            users={users}
            onEdit={handleEdit}
          />
        </div>

        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New User"
        >
          <UserCreateForm onClose={() => setShowCreateModal(false)} />
        </Modal>

        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit User"
        >
          <UserEditForm
            user={selectedUser}
            onClose={() => setShowEditModal(false)}
          />
        </Modal>
      </div>
    </div>
  );
};

export default UserManagementPage; 