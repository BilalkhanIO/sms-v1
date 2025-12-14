import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '../../api/usersApi';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import PageHeader from '../../components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Save, User } from 'lucide-react';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { data: userProfile, isLoading, isError, error, refetch } = useGetUserProfileQuery();
  const [updateUserProfile, { isLoading: isUpdating, isSuccess, isError: isUpdateError, error: updateError, reset }] = useUpdateUserProfileMutation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    // Add other fields that can be updated, e.g., password, profilePicture
  });
  const [localErrors, setLocalErrors] = useState({});

  useEffect(() => {
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
      });
    }
  }, [userProfile]);

  useEffect(() => {
    if (isSuccess) {
      alert('Profile updated successfully!');
      reset();
      refetch(); // Refetch to ensure latest data is displayed
    }
    if (isUpdateError) {
      console.error('Update profile failed', updateError);
      alert(`Error updating profile: ${updateError.data?.message || updateError.message || 'Unknown Error'}`);
    }
  }, [isSuccess, isUpdateError, reset, updateError, refetch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (localErrors[name]) {
      setLocalErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Basic client-side validation (can be enhanced with Yup)
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setLocalErrors({ general: 'All fields are required.' });
        return;
      }
      // Assuming email format is checked by backend validation

      await updateUserProfile(formData).unwrap();
    } catch (err) {
      console.error('Failed to update profile:', err);
      if (err.data?.errors) {
        const validationErrors = {};
        err.data.errors.forEach(e => validationErrors[e.path] = e.msg);
        setLocalErrors(validationErrors);
      } else {
        setLocalErrors({ general: err.data?.message || err.message || 'Failed to update profile.' });
      }
    }
  };

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (isError) {
    return (
      <ErrorMessage>
        Error loading profile: {error.data?.message || error.error || 'Unknown Error'}
      </ErrorMessage>
    );
  }

  if (!userProfile) {
    return <ErrorMessage>User profile not found.</ErrorMessage>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="User Profile">
        <User className="h-6 w-6 text-gray-700" />
      </PageHeader>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Your Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={isUpdating}
              />
              {localErrors.firstName && <p className="text-red-500 text-xs mt-1">{localErrors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isUpdating}
              />
              {localErrors.lastName && <p className="text-red-500 text-xs mt-1">{localErrors.lastName}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isUpdating}
              />
              {localErrors.email && <p className="text-red-500 text-xs mt-1">{localErrors.email}</p>}
            </div>

            {/* Add other editable fields here if necessary */}

            {localErrors.general && (
              <p className="text-red-500 text-sm mt-2">{localErrors.general}</p>
            )}

            <div className="flex justify-end space-x-4 mt-6">
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfilePage;
