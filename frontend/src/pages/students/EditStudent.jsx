import React from 'react';
import { useParams } from 'react-router-dom';
import StudentForm from '../../components/StudentForm';
import { useGetStudentByIdQuery } from '../../api/studentApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditStudent = () => {
  const { id } = useParams();
  const { data: student, isLoading, error } = useGetStudentByIdQuery(id);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-4">Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Student</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update the student information below.
        </p>
      </div>
      <StudentForm student={student} />
    </div>
  );
};

export default EditStudent;