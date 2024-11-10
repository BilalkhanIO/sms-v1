import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '../../redux/features/profileSlice';
import { useToast } from '../../contexts/ToastContext';

const UserProfileForm = ({ initialData }) => {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    avatar: null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(initialData.avatar || '');
  
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar' && files?.length) {
      setFormData({ ...formData, avatar: files[0] });
      setPreviewUrl(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (showPasswordFields) {
      if (formData.newPassword !== formData.confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }
      if (formData.newPassword && formData.newPassword.length < 6) {
        showToast('Password must be at least 6 characters long', 'error');
        return;
      }
    }

    try {
      const dataToSubmit = { ...formData };
      if (!showPasswordFields) {
        delete dataToSubmit.currentPassword;
        delete dataToSubmit.newPassword;
        delete dataToSubmit.confirmPassword;
      }
      
      await dispatch(updateUserProfile(dataToSubmit)).unwrap();
      showToast('Profile updated successfully', 'success');
      setShowPasswordFields(false);
    } catch (error) {
      showToast(error.message || 'Failed to update profile', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Avatar Upload */}
        <div className="sm:col-span-2">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <img
                className="h-24 w-24 rounded-full object-cover"
                src={previewUrl || 'https://via.placeholder.com/96'}
                alt="Profile"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture
              </label>
              <input
                type="file"
                name="avatar"
                onChange={handleInputChange}
                accept="image/*"
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Password Change Section */}
        <div className="sm:col-span-2">
          <button
            type="button"
            onClick={() => setShowPasswordFields(!showPasswordFields)}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            {showPasswordFields ? 'Cancel Password Change' : 'Change Password'}
          </button>
        </div>

        {showPasswordFields && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default UserProfileForm; 