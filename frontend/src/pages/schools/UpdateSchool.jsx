import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useGetSchoolByIdQuery, useUpdateSchoolMutation } from '../../api/schoolsApi';

const UpdateSchool = () => {
  const navigate = useNavigate();
  const { id: schoolId } = useParams();
  const { data: school, isLoading: isSchoolLoading, isError: isSchoolError, error: schoolError } = useGetSchoolByIdQuery(schoolId);
  const [updateSchool, { isLoading: isUpdating }] = useUpdateSchoolMutation();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactInfo: {
      phone: '',
      email: '',
    },
    status: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (school) {
      setFormData({
        name: school.name || '',
        address: school.address || '',
        contactInfo: {
          phone: school.contactInfo?.phone || '',
          email: school.contactInfo?.email || '',
        },
        status: school.status || '',
      });
    }
  }, [school]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contactInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSchool({ id: schoolId, ...formData }).unwrap();
      navigate('/dashboard/schools');
    } catch (err) {
      const validationErrors = {};
      if (err.data?.errors) {
        err.data.errors.forEach(error => {
          if (error.path.includes('.')) {
            validationErrors[error.path] = error.msg;
          } else {
            validationErrors[error.path] = error.msg;
          }
        });
      } else if (err.data?.message) {
        validationErrors.general = err.data.message;
      }
      setErrors(validationErrors);
    }
  };

  if (isSchoolLoading) {
    return <Spinner size="large" />;
  }

  if (isSchoolError) {
    return (
      <ErrorMessage>
        Error: {schoolError.data?.message || schoolError.error || 'Failed to load school for editing'}
      </ErrorMessage>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title={`Edit School: ${school?.name}`} backUrl="/dashboard/schools" />
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <Input
          label="School Name"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        <Input
          label="Address"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
          required
        />
        <Input
          label="Contact Phone"
          id="contactInfo.phone"
          name="contactInfo.phone"
          value={formData.contactInfo.phone}
          onChange={handleChange}
          error={errors['contactInfo.phone']}
          required
        />
        <Input
          label="Contact Email"
          type="email"
          id="contactInfo.email"
          name="contactInfo.email"
          value={formData.contactInfo.email}
          onChange={handleChange}
          error={errors['contactInfo.email']}
          required
        />

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
          </select>
          {errors.status && (
            <p className="mt-2 text-sm text-red-600">{errors.status}</p>
          )}
        </div>

        {errors.general && (
          <div className="text-red-500 text-sm mt-2">{errors.general}</div>
        )}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/dashboard/schools')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isUpdating}
          >
            Update School
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateSchool;