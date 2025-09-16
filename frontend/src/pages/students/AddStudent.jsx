import React from 'react';
import StudentForm from '../../components/StudentForm';

const AddStudent = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Student</h1>
        <p className="mt-2 text-sm text-gray-600">
          Fill in the student details below to create a new student record.
        </p>
      </div>
      <StudentForm />
    </div>
  );
};

export default AddStudent;