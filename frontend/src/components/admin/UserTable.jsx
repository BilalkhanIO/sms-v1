import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser, deleteUser } from '../../redux/features/userSlice';
import { 
  PencilIcon, 
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon 
} from '@heroicons/react/24/outline';
import ConfirmDialog from '../common/ConfirmDialog';
import { ROLES } from '../../utils/constants';
import { useToast } from '../../contexts/ToastContext';

const UserTable = ({ users = [], loading, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleRoleChange = async (user, newRole) => {
    try {
      if (!user || !user.id) {
        throw new Error('Invalid user data');
      }

      await dispatch(updateUser({ 
        id: user.id,
        userData: { role: newRole } 
      })).unwrap();

      addToast('Role updated successfully', 'success');
    } catch (error) {
      addToast(error.message || 'Failed to update role', 'error');
      console.error('Failed to update role:', error);
    }
  };

  const handleStatusToggle = async (user) => {
    if (!user || !user.id) return;
    
    try {
      const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await dispatch(updateUser({ 
        id: user.id,
        userData: { status: newStatus } 
      })).unwrap();
      
      addToast(`User status updated to ${newStatus.toLowerCase()}`, 'success');
    } catch (error) {
      addToast(error.message || 'Failed to update status', 'error');
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser?.id) return;
    
    try {
      await dispatch(deleteUser(selectedUser.id)).unwrap();
      setShowDeleteDialog(false);
      setSelectedUser(null);
      onDelete?.(selectedUser.id);
      addToast('User deleted successfully', 'success');
    } catch (error) {
      addToast(error.message || 'Failed to delete user', 'error');
      console.error('Failed to delete user:', error);
    }
  };

  const StatusBadge = ({ status }) => {
    const statusColors = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-red-100 text-red-800',
      PENDING: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={user.profilePicture || '/default-avatar.png'}
                        alt={`${user.firstName} ${user.lastName}`}
                      />
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
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user, e.target.value)}
                    className="text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {Object.values(ROLES).map((role) => (
                      <option key={`${user.id}-role-${role}`} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDeleteDialog(true);
                    }}
                    className="text-red-600 hover:text-red-900 ml-4"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.firstName} ${selectedUser?.lastName}? This action cannot be undone.`}
      />
    </>
  );
};

export default UserTable; 