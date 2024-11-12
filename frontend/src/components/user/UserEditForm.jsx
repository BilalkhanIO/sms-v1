import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/features/userSlice';
import { useToast } from '../../contexts/ToastContext';
import { ROLES } from '../../utils/permissions';

const UserEditForm = ({ user, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: '',
    phoneNumber: '',
  });

  const dispatch = useDispatch();
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      setFormData({
        name:user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phoneNumber: user.phoneNumber,
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      await dispatch(updateUser({ 
        id: user._id, 
        userData: formDataToSend 
      })).unwrap();
      
      showToast('User updated successfully', 'success');
      onClose();
    } catch (error) {
      showToast(error.message || 'Failed to update user', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            {Object.values(ROLES).map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
        />
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default UserEditForm; 