import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '../api/usersApi';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Input from './common/Input';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { Save, User, Mail, Phone, MapPin } from 'lucide-react';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: profile, isLoading, error } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Error loading profile: {error.data?.message || 'Unknown error'}
      </div>
    );
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updateProfile(values).unwrap();
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.data?.message || 'Update failed');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {profile?.firstName} {profile?.lastName}
              </h1>
              <p className="text-blue-100 capitalize">
                {profile?.role?.toLowerCase().replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}

          <Formik
            initialValues={{
              firstName: profile?.firstName || '',
              lastName: profile?.lastName || '',
              email: profile?.email || '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Field
                      as={Input}
                      label="First Name"
                      name="firstName"
                      id="firstName"
                      placeholder="Enter first name"
                    />
                    <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <Field
                      as={Input}
                      label="Last Name"
                      name="lastName"
                      id="lastName"
                      placeholder="Enter last name"
                    />
                    <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                <div>
                  <Field
                    as={Input}
                    label="Email"
                    name="email"
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    isLoading={isSubmitting || isUpdating}
                    disabled={isSubmitting || isUpdating}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Update Profile
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

          {/* Profile Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{profile?.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <p className="text-sm text-gray-900 capitalize">
                    {profile?.role?.toLowerCase().replace('_', ' ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-sm text-gray-900 capitalize">
                    {profile?.status?.toLowerCase().replace('_', ' ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Login</p>
                  <p className="text-sm text-gray-900">
                    {profile?.lastLogin ? new Date(profile.lastLogin).toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;