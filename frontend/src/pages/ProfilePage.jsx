import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, uploadProfilePicture } from '../redux/features/userSlice';
import { useToast } from '../contexts/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ProfileForm from '../components/ProfileForm';
import api from '../services/api';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const user = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/auth/profile');
      setProfile(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
      addToast('Could not load profile. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select an image file', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      setLoading(true);
      await dispatch(uploadProfilePicture(formData)).unwrap();
      addToast('Profile picture updated successfully', 'success');
      fetchProfile(); // Refresh profile data
    } catch (error) {
      addToast(error.message || 'Failed to update profile picture', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const response = await api.put('/auth/profile', formData);
      setProfile(response.data.data);
      addToast('Profile updated successfully', 'success');
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error}
        retry={fetchProfile}
      />
    );
  }

  return (
    <div className="profile-container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      {profile && (
        <ProfileForm 
          initialData={profile}
          onSubmit={handleSubmit}
          onProfilePictureChange={handleProfilePictureChange}
          isSubmitting={loading}
        />
      )}
    </div>
  );
};

export default ProfilePage; 