import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import PageHeader from '../../components/common/PageHeader';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField'; // Assuming a SelectField component exists
import { useGetUserByIdQuery, useUpdateUserMutation } from '../../api/usersApi';
import Spinner from '../../components/common/Spinner';
import ErrorMessageComponent from '../../components/common/ErrorMessage'; // Renamed to avoid conflict
import Button from '../../components/common/Button'; // Assuming a Button component exists
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  role: Yup.string()
    .oneOf(
      ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
      'Invalid role'
    )
    .required('Role is required'),
  status: Yup.string()
    .oneOf(
      ['ACTIVE', 'INACTIVE', 'PENDING_EMAIL_VERIFICATION', 'PENDING_ADMIN_APPROVAL', 'SUSPENDED', 'DELETED'],
      'Invalid Status'
    )
    .required('Status is required'),
  // Add validation for role-specific fields if necessary, similar to CreateUserForm
  // employeeId: Yup.string().when('role', {
  //   is: 'TEACHER',
  //   then: () => Yup.string().required('Employee ID is required for teachers'),
  //   otherwise: () => Yup.string().notRequired(),
  // }),
});

const UpdateUser = () => {
  const navigate = useNavigate();
  const { id: userId } = useParams();
  const { data: user, isLoading, isError, error } = useGetUserByIdQuery(userId);
  const [updateUser, { isLoading: isUpdating, isSuccess, isError: isUpdateError, error: updateError, reset }] = useUpdateUserMutation();

  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    status: '',
    // Add role-specific fields for display/edit if needed
  });

  useEffect(() => {
    if (user) {
      setInitialValues({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || '',
        status: user.status || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      alert('User updated successfully!');
      reset(); // Reset mutation state
      navigate('/dashboard/users');
    }
    if (isUpdateError) {
      console.error('Update user failed', updateError);
      alert(`Error updating user: ${updateError.data?.message || updateError.message || 'Unknown Error'}`);
    }
  }, [isSuccess, isUpdateError, navigate, reset, updateError]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updateUser({ id: userId, ...values }).unwrap();
    } catch (err) {
      // Error handling is done in useEffect
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (isError) {
    return (
      <ErrorMessageComponent>
        Error loading user: {error.data?.message || error.message || 'Unknown Error'}
      </ErrorMessageComponent>
    );
  }

  if (!user) {
    return <ErrorMessageComponent>User not found.</ErrorMessageComponent>;
  }

  // Define role options for the select field
  const roleOptions = [
    { value: 'SUPER_ADMIN', label: 'Super Admin' },
    { value: 'SCHOOL_ADMIN', label: 'School Admin' },
    { value: 'TEACHER', label: 'Teacher' },
    { value: 'STUDENT', label: 'Student' },
    { value: 'PARENT', label: 'Parent' },
  ];

  // Define status options for the select field
  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'PENDING_EMAIL_VERIFICATION', label: 'Pending Email Verification' },
    { value: 'PENDING_ADMIN_APPROVAL', label: 'Pending Admin Approval' },
    { value: 'SUSPENDED', label: 'Suspended' },
    { value: 'DELETED', label: 'Deleted' },
  ];

  return (
    <>
      <PageHeader title={`Edit User: ${user.firstName} ${user.lastName}`} backUrl="/dashboard/users" />
      <div className="container mx-auto p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize // Important for updating form with fetched data
        >
          {({ isSubmitting, values }) => (
            <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <InputField label="First Name" name="firstName" type="text" required />
              <InputField label="Last Name" name="lastName" type="text" required />
              <InputField label="Email" name="email" type="email" required />

              <SelectField label="Role" name="role" options={roleOptions} required />
              <SelectField label="Status" name="status" options={statusOptions} required />

              {/* Add role-specific fields here if needed for editing */}
              {/* Example for a teacher, using conditional rendering based on values.role */}
              {/* {values.role === 'TEACHER' && (
                <InputField label="Employee ID" name="employeeId" type="text" />
              )} */}

              <div className="flex items-center justify-between mt-6">
                <Button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={isSubmitting || isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" /> Update User
                    </>
                  )}
                </Button>
                <Link
                  to="/dashboard/users"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <ArrowLeft size={16} className="mr-2" /> Back to Users
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default UpdateUser;