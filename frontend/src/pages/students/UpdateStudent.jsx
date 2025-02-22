import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Spinner from '../../components/common/Spinner';
import { useGetStudentByIdQuery, useUpdateStudentMutation } from '../../api/studentApi';

const UpdateStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: student, isLoading: isLoadingStudent } = useGetStudentByIdQuery(id);
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    rollNumber: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    email: '',
    address: '',
    parentName: '',
    parentContact: '',
    parentEmail: '',
    parentRelationship: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName,
        lastName: student.lastName,
        rollNumber: student.rollNumber,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        contactNumber: student.contactNumber || '',
        email: student.email,
        address: student.address || '',
        parentName: student.parent?.name || '',
        parentContact: student.parent?.contactNumber || '',
        parentEmail: student.parent?.email || '',
        parentRelationship: student.parent?.relationship || '',
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStudent({ id, ...formData }).unwrap();
      navigate('/students');
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

  if (isLoadingStudent) {
    return <Spinner size="large" />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="Update Student" backUrl="/students" />
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
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
              label="Roll Number"
              id="rollNumber"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              error={errors.rollNumber}
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
              label="Gender"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              error={errors.gender}
              required
            />

            <Input
              label="Contact Number"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              error={errors.contactNumber}
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
              label="Address"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
            />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Parent/Guardian Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Parent Name"
              id="parentName"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              error={errors.parentName}
              required
            />

            <Input
              label="Parent Contact"
              id="parentContact"
              name="parentContact"
              value={formData.parentContact}
              onChange={handleChange}
              error={errors.parentContact}
              required
            />

            <Input
              label="Parent Email"
              type="email"
              id="parentEmail"
              name="parentEmail"
              value={formData.parentEmail}
              onChange={handleChange}
              error={errors.parentEmail}
            />

            <Input
              label="Relationship"
              id="parentRelationship"
              name="parentRelationship"
              value={formData.parentRelationship}
              onChange={handleChange}
              error={errors.parentRelationship}
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/students')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isUpdating}
          >
            Update Student
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateStudent; 