import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser } from '../../redux/features/userSlice';
import UserFilters from './UserFilters';
import { USER_ROLES, USER_STATUS } from '../../constants/user';
import { 
  PencilIcon, 
  TrashIcon, 
  UserCircleIcon 
} from '@heroicons/react/outline';
import ConfirmDialog from '../common/ConfirmDialog';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { useToast } from '../../contexts/ToastContext';

const UserList = () => {
  const dispatch = useDispatch();
  const { users, loading, error, total, page, limit } = useSelector(state => state.user);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const { addToast } = useToast();

  useEffect(() => {
    dispatch(fetchUsers({ ...filters, page, limit }));
  }, [dispatch, filters, page, limit]);

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteUser(selectedUser.id)).unwrap();
      addToast('User deleted successfully', 'success');
      setShowDeleteDialog(false);
      setSelectedUser(null);
    } catch (error) {
      addToast(error.message || 'Failed to delete user', 'error');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      [USER_STATUS.ACTIVE]: 'bg-green-100 text-green-800',
      [USER_STATUS.INACTIVE]: 'bg-red-100 text-red-800',
      [USER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <UserFilters filters={filters} setFilters={setFilters} />

      {/* User Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {user.profilePicture ? (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.profilePicture}
                          alt={user.firstName}
                        />
                      ) : (
                        <UserCircleIcon className="h-10 w-10 text-gray-400" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => navigate(`/users/${user.id}/edit`)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => dispatch(setPage(page - 1))}
              disabled={page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => dispatch(setPage(page + 1))}
              disabled={page * limit >= total}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(page * limit, total)}
                </span>{' '}
                of <span className="font-medium">{total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => dispatch(setPage(page - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Previous
                </button>
                {/* Add page numbers here if needed */}
                <button
                  onClick={() => dispatch(setPage(page + 1))}
                  disabled={page * limit >= total}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.firstName} ${selectedUser?.lastName}? This action cannot be undone.`}
      />
    </div>
  );
};

export default UserList;
