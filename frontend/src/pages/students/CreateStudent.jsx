import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useCreateStudentMutation } from '../../api/studentApi';
import { useGetClassesQuery } from '../../api/classApi';
import { useGetParentsQuery } from '../../api/parentApi';
import Spinner from '../../components/common/Spinner';

const CreateStudent = () => {
  const navigate = useNavigate();
  const [createStudent, { isLoading }] = useCreateStudentMutation();
  const { data: classes, isLoading: classesLoading } = useGetClassesQuery();
  const { data: parents, isLoading: parentsLoading } = useGetParentsQuery();
  
  const [formData, setFormData] = useState({
    admissionNumber: '',
    rollNumber: '',
    class: '',
    dateOfBirth: '',
    gender: '',
    parentInfo: {
      father: {
        name: '',
        occupation: '',
        contact: '',
      },
      mother: {
        name: '',
        occupation: '',
        contact: '',
      },
      guardian: '',
    },
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'USA',
    },
    documents: [],
    status: 'ACTIVE',
  });
  
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataWithFiles = new FormData();
      
      // Append JSON data
      Object.keys(formData).forEach(key => {
        if (key !== 'documents') {
          formDataWithFiles.append(key, 
            typeof formData[key] === 'object' 
              ? JSON.stringify(formData[key]) 
              : formData[key]
          );
        }
      });
      
      // Append files
      files.forEach(file => {
        formDataWithFiles.append('documents', file);
      });

      await createStudent(formDataWithFiles).unwrap();
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

  if (classesLoading || parentsLoading) {
    return <Spinner size="large" />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="Create Student" backUrl="/students" />
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Admission Number"
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
            isLoading={isLoading}
          >
            Create Student
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateStudent; 