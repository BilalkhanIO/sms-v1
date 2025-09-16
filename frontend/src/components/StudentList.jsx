// src/components/StudentList.jsx
import React from 'react';
import { useGetStudentsByClassQuery, useGetStudentsQuery } from '../api/studentApi';
import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const StudentList = () => {
  const { classId } = useParams();
  const {
    data: students,
    isLoading,
    error
  } = classId ? useGetStudentsByClassQuery(classId) : useGetStudentsQuery();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-4">Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {classId ? `Students in ${students?.[0]?.class?.name || 'Class'}` : 'All Students'}
        </h2>
        <Link
          to="/students/new"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center"
        >
          <span className="mr-2">Add Student</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students?.map((student) => (
          <div
            key={student._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={student.profileImage || '/default-avatar.png'}
                  alt={`${student.firstName} ${student.lastName}`}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {student.firstName} {student.lastName}
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-gray-600 flex items-center">
                      <span className="font-medium mr-2">Roll No:</span>
                      {student.rollNumber}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <span className="font-medium mr-2">Class:</span>
                      {student.class?.name || 'Not Assigned'}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <span className="font-medium mr-2">Guardian:</span>
                      {student.parentInfo?.guardian?.user?.firstName} {student.parentInfo?.guardian?.user?.lastName || 'Not Assigned'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                <Link
                  to={`/students/${student._id}`}
                  className="inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors duration-200"
                >
                  <span>View Details</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentList;


