import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectUsers,
  selectLoading,
  selectError,
  selectSuccess,
  selectSelectedUser,
  fetchUsers,
  clearError,
  clearSuccess,
  setSelectedUser as setReduxSelectedUser,
  clearSelectedUser,
  deleteUser
} from '../../redux/features/userSlice';
import UserTable from '../../components/admin/UserTable';
import UserFilters from '../../components/admin/UserFilters';
import UserCreateForm from '../../components/user/UserCreateForm';
import UserEditForm from '../../components/user/UserEditForm';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const UserManagementPage = () => {
  const dispatch = useDispatch();
  
  // Use selectors with default values
  const users = useSelector(selectUsers) || [];
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const selectedUser = useSelector(selectSelectedUser);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    search: '',
  });

  // Fetch users on mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Clear states when modals close
  useEffect(() => {
    if (!showCreateModal && !showEditModal) {
      dispatch(clearError());
      dispatch(clearSuccess());
      dispatch(clearSelectedUser());
    }
  }, [showCreateModal, showEditModal, dispatch]);

  const handleEdit = (user) => {
    dispatch(setReduxSelectedUser(user));
    setShowEditModal(true);
  };

  const handleDelete = async (userId) => {
    try {
      await dispatch(deleteUser(userId)).unwrap();
      dispatch(fetchUsers());
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    dispatch(fetchUsers());
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    dispatch(fetchUsers());
  };

  // Filter users safely
  const filteredUsers = users.filter(user => {
    const matchesRole = !filters.role || user.role === filters.role;
    const matchesStatus = !filters.status || user.status === filters.status;
    const matchesSearch = !filters.search || 
      user.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email?.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesRole && matchesStatus && matchesSearch;
  });

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

        <UserFilters 
          filters={filters} 
          setFilters={setFilters} 
        />

        <div className="mt-4">
          <UserTable
            users={filteredUsers}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <Modal
          isOpen={showCreateModal}
          onClose={handleCloseCreateModal}
          title="Create New User"
        >
          <UserCreateForm onClose={handleCloseCreateModal} onSuccess={handleCreateSuccess} />
        </Modal>

        <Modal
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          title="Edit User"
        >
          <UserEditForm
            user={selectedUser}
            onClose={handleCloseEditModal}
            onSuccess={handleEditSuccess}
          />
        </Modal>
      </div>
    </div>
  );
};

export default UserManagementPage;