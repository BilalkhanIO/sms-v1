import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createUser, updateUser, fetchUserById } from '../../redux/features/userSlice';
import { USER_ROLES, USER_STATUS, GENDER_OPTIONS } from '../../constants/user';
import { validateUser } from '../../utils/validation/userValidation';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { useToast } from '../../contexts/ToastContext';

const UserForm = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedUser, loading, error } = useSelector(state => state.user);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    status: USER_STATUS.ACTIVE,
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    }
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (selectedUser && userId) {
      setFormData({
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.email,
        role: selectedUser.role,
        status: selectedUser.status,
        phoneNumber: selectedUser.phoneNumber || '',
        gender: selectedUser.gender || '',
        dateOfBirth: selectedUser.dateOfBirth || '',
        address: selectedUser.address || {
          street: '',
          city: '',
          state: '',
          country: '',
          postalCode: ''
        }
      });
    }
  }, [selectedUser, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateUser(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (userId) {
        await dispatch(updateUser({ id: userId, userData: formData })).unwrap();
        addToast('User updated successfully', 'success');
      } else {
        await dispatch(createUser(formData)).unwrap();
        addToast('User created successfully', 'success');
      }
      navigate('/users');
    } catch (error) {
      addToast(error.message || 'Failed to save user', 'error');
    }
  };

  const handleInputChange = (e, section = null) => {
    const { name, value } = e.target;
    
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when field is modified
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200">
        {/* Basic Information */}
        <div className="pt-8">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Basic Information
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              User's personal information and role.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  formErrors.firstName ? 'border-red-300' : ''
                }`}
              />
              {formErrors.firstName && (
                <p className="mt-2 text-sm text-red-600">{formErrors.firstName}</p>
              )}
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  formErrors.lastName ? 'border-red-300' : ''
                }`}
              />
              {formErrors.lastName && (
                <p className="mt-2 text-sm text-red-600">{formErrors.lastName}</p>
              )}
            </div>

            <div className="sm:col-span-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  formErrors.email ? 'border-red-300' : ''
                }`}
              />
              {formErrors.email && (
                <p className="mt-2 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  formErrors.role ? 'border-red-300' : ''
                }`}
              >
                <option value="">Select Role</option>
                {Object.values(USER_ROLES).map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              {formErrors.role && (
                <p className="mt-2 text-sm text-red-600">{formErrors.role}</p>
              )}
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {Object.values(USER_STATUS).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="pt-8">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Contact Information
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              User's contact details and address.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                name="street"
                value={formData.address.street}
                onChange={(e) => handleInputChange(e, 'address')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.address.city}
                onChange={(e) => handleInputChange(e, 'address')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                State / Province
              </label>
              <input
                type="text"
                name="state"
                value={formData.address.state}
                onChange={(e) => handleInputChange(e, 'address')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                ZIP / Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.address.postalCode}
                onChange={(e) => handleInputChange(e, 'address')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/users')}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {userId ? 'Update User' : 'Create User'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default UserForm;
