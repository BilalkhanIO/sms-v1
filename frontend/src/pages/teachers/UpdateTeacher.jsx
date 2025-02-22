import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Spinner from '../../components/common/Spinner';
import { useGetTeacherByIdQuery, useUpdateTeacherMutation } from '../../api/teacherApi';

const UpdateTeacher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: teacher, isLoading: isLoadingTeacher } = useGetTeacherByIdQuery(id);
  const [updateTeacher, { isLoading: isUpdating }] = useUpdateTeacherMutation();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (teacher) {
      setFormData({
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        phone: teacher.phone || '',
        subject: teacher.subject || '',
      });
    }
  }, [teacher]);

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
      await updateTeacher({ id, ...formData }).unwrap();
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

  if (isLoadingTeacher) {
    return <Spinner size="large" />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="Update Teacher" backUrl="/teachers" />
      
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
          label="Phone"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
        />

        <Input
          label="Subject"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          error={errors.subject}
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
            isLoading={isUpdating}
          >
            Update Teacher
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTeacher; 