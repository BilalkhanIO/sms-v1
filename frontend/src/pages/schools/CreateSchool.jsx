import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useCreateSchoolMutation } from '../../api/schoolsApi';

const CreateSchool = () => {
  const navigate = useNavigate();
  const [createSchool, { isLoading }] = useCreateSchoolMutation();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactInfo: {
      phone: '',
      email: '',
    },
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
  });
  const [errors, setErrors] = useState({});

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
      await createSchool(formData).unwrap();
      navigate('/dashboard/schools');
    } catch (err) {
      const validationErrors = {};
      if (err.data?.errors) {
        err.data.errors.forEach(error => {
          // This assumes `err.data.errors` is an array of objects like { path: 'fieldName', msg: 'message' }
          // Adjust 'path' to match your backend's error structure if different
          // For nested fields like contactInfo.email, the path might be 'contactInfo.email'
          if (error.path.includes('.')) {
            validationErrors[error.path] = error.msg;
          } else {
            validationErrors[error.path] = error.msg;
          }
        });
      } else if (err.data?.message) {
        // Handle generic backend error messages not tied to specific fields
        validationErrors.general = err.data.message;
      }
      setErrors(validationErrors);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="Create New School" backUrl="/dashboard/schools" />
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">School Details</h3>
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

        <h3 className="text-xl font-semibold mb-4 border-b pb-2 mt-8">Admin User Details</h3>
        <Input
          label="Admin First Name"
          id="adminFirstName"
          name="adminFirstName"
          value={formData.adminFirstName}
          onChange={handleChange}
          error={errors.adminFirstName}
          required
        />
        <Input
          label="Admin Last Name"
          id="adminLastName"
          name="adminLastName"
          value={formData.adminLastName}
          onChange={handleChange}
          error={errors.adminLastName}
          required
        />
        <Input
          label="Admin Email"
          type="email"
          id="adminEmail"
          name="adminEmail"
          value={formData.adminEmail}
          onChange={handleChange}
          error={errors.adminEmail}
          required
        />

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
            isLoading={isLoading}
          >
            Create School
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateSchool;