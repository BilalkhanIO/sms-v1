import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, uploadProfilePicture } from '../../redux/features/userSlice';
import { UserCircleIcon, CameraIcon } from '@heroicons/react/outline';
import { useToast } from '../../contexts/ToastContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { currentUserProfile, loading, error } = useSelector(state => state.user);
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    }
  });

  useEffect(() => {
    if (currentUserProfile) {
      setFormData({
        firstName: currentUserProfile.firstName || '',
        lastName: currentUserProfile.lastName || '',
        email: currentUserProfile.email || '',
        phoneNumber: currentUserProfile.phoneNumber || '',
        dateOfBirth: currentUserProfile.dateOfBirth || '',
        gender: currentUserProfile.gender || '',
        address: currentUserProfile.address || {
          street: '',
          city: '',
          state: '',
          country: '',
          postalCode: ''
        },
        emergencyContact: currentUserProfile.emergencyContact || {
          name: '',
          relationship: '',
          phone: ''
        }
      });
    }
  }, [currentUserProfile]);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserProfile({
        id: currentUserProfile.id,
        profileData: formData
      })).unwrap();
      addToast('Profile updated successfully', 'success');
      setIsEditing(false);
    } catch (error) {
      addToast(error.message || 'Failed to update profile', 'error');
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await dispatch(uploadProfilePicture({
        id: currentUserProfile.id,
        file
      })).unwrap();
      addToast('Profile picture updated successfully', 'success');
    } catch (error) {
      addToast(error.message || 'Failed to update profile picture', 'error');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {/* Profile Header */}
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Profile Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Personal details and information.
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Picture */}
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="flex justify-center">
            <div className="relative">
              {currentUserProfile?.profilePicture ? (
                <img
                  src={currentUserProfile.profilePicture}
                  alt="Profile"
                  className="h-32 w-32 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="h-32 w-32 text-gray-300" />
              )}
              <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer"
              >
                <CameraIcon className="h-5 w-5 text-gray-400" />
                <input
                  type="file"
                  id="profile-picture"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit}>
          <div className="border-t border-gray-200">
            <dl>
              {/* Personal Information */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Last Name"
                      />
                    </div>
                  ) : (
                    `${currentUserProfile?.firstName} ${currentUserProfile?.lastName}`
                  )}
                </dd>
              </div>

              {/* Contact Information */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  ) : (
                    currentUserProfile?.email
                  )}
                </dd>
              </div>

              {/* Phone Number */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  ) : (
                    currentUserProfile?.phoneNumber || 'Not provided'
                  )}
                </dd>
              </div>

              {/* Address */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="street"
                        value={formData.address.street}
                        onChange={(e) => handleInputChange(e, 'address')}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Street Address"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="city"
                          value={formData.address.city}
                          onChange={(e) => handleInputChange(e, 'address')}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="City"
                        />
                        <input
                          type="text"
                          name="state"
                          value={formData.address.state}
                          onChange={(e) => handleInputChange(e, 'address')}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="State"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.address.postalCode}
                          onChange={(e) => handleInputChange(e, 'address')}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Postal Code"
                        />
                        <input
                          type="text"
                          name="country"
                          value={formData.address.country}
                          onChange={(e) => handleInputChange(e, 'address')}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Country"
                        />
                      </div>
                    </div>
                  ) : (
                    <address className="not-italic">
                      {currentUserProfile?.address?.street}<br />
                      {currentUserProfile?.address?.city}, {currentUserProfile?.address?.state} {currentUserProfile?.address?.postalCode}<br />
                      {currentUserProfile?.address?.country}
                    </address>
                  )}
                </dd>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Emergency Contact</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="name"
                        value={formData.emergencyContact.name}
                        onChange={(e) => handleInputChange(e, 'emergencyContact')}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Contact Name"
                      />
                      <input
                        type="text"
                        name="relationship"
                        value={formData.emergencyContact.relationship}
                        onChange={(e) => handleInputChange(e, 'emergencyContact')}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Relationship"
                      />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.emergencyContact.phone}
                        onChange={(e) => handleInputChange(e, 'emergencyContact')}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Phone Number"
                      />
                    </div>
                  ) : (
                    <div>
                      <p>{currentUserProfile?.emergencyContact?.name}</p>
                      <p className="text-gray-500">{currentUserProfile?.emergencyContact?.relationship}</p>
                      <p>{currentUserProfile?.emergencyContact?.phone}</p>
                    </div>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* Form Actions */}
          {isEditing && (
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
