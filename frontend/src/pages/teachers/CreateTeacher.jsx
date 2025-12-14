import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useCreateTeacherMutation } from '../../api/teacherApi';

const CreateTeacher = () => {
  const navigate = useNavigate();
  const [createTeacher, { isLoading }] = useCreateTeacherMutation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    employeeId: '',
    qualification: '',
    specialization: '',
    address: '',
    contactInfo: {
      phone: '',
    },
    dateOfBirth: '', // Assuming ISO8601 string for date input type 'date'
    salary: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle nested contactInfo
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
      await createTeacher(formData).unwrap();
      navigate('/teachers');
    } catch (error) {
      const validationErrors = {};
      if (error.data?.errors) {
        error.data.errors.forEach(err => {
          validationErrors[err.field] = err.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="Create Teacher" backUrl="/teachers" />
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <Input
          label="First Name"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
          required
        />

        <Input
          label="Last Name"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
          required
        />

        <Input
          label="Email"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        
        <Input
          label="Employee ID"
          id="employeeId"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          error={errors.employeeId}
          required
        />

        <Input
          label="Qualification"
          id="qualification"
          name="qualification"
          value={formData.qualification}
          onChange={handleChange}
          error={errors.qualification}
          required
        />

        <Input
          label="Specialization"
          id="specialization"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          error={errors.specialization}
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
          label="Phone Number"
          id="contactInfo.phone"
          name="contactInfo.phone"
          value={formData.contactInfo.phone}
          onChange={handleChange}
          error={errors['contactInfo.phone']} // Access error for nested field
          required
        />

        <Input
          label="Date of Birth"
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          error={errors.dateOfBirth}
          required
        />

        <Input
          label="Salary"
          type="number"
          id="salary"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          error={errors.salary}
          required
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/teachers')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
          >
            Create Teacher
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTeacher; 