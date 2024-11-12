import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createUser } from '../../redux/features/userSlice';
import { useToast } from '../../contexts/ToastContext';
import { ROLES } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import Toast from '../common/Toast';

const UserCreateForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'TEACHER',
    status: 'ACTIVE',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { addToast } = useToast();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.phoneNumber && !/^\+?[\d\s-]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      await dispatch(createUser(formDataToSend)).unwrap();
      addToast('User created successfully', 'success');
      onClose();
    } catch (error) {
      addToast(error.message || 'Failed to create user', 'error');
    } finally {
      setLoading(false);
    }
  };
  if(loading){
    <LoadingSpinner/>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
              ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email *
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
            Password *
          </label>
          <input
            type="password"
            required
            minLength={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
              ${errors.phoneNumber ? 'border-red-300' : 'border-gray-300'}`}
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
        >
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </div>
    </form>
  );
};

export default UserCreateForm; 