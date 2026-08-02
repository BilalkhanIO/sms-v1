import React from 'react';
import { useGetStudentsByClassQuery, useGetStudentsQuery } from '../api/studentApi';
import { Link } from 'react-router-dom';
import Spinner from './common/Spinner';

const StudentList = ({ classId }) => {
  const { data: byClassRaw, isLoading: loadingClass } = useGetStudentsByClassQuery(classId, { skip: !classId });
  const { data: allRaw, isLoading: loadingAll } = useGetStudentsQuery(undefined, { skip: Boolean(classId) });

  const isLoading = classId ? loadingClass : loadingAll;
  const raw = classId ? byClassRaw : allRaw;
  const students = raw?.data || raw || [];

  if (isLoading) return <Spinner />;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {classId ? 'Students in Class' : 'All Students'}
        </h2>
        <Link
          to="/dashboard/students/create"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
        >
          Add Student
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div key={student._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800">
                {student.user?.firstName || ''} {student.user?.lastName || ''}
              </h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p><span className="font-medium mr-2">Roll No:</span>{student.rollNumber || '—'}</p>
                <p><span className="font-medium mr-2">Class:</span>{student.class?.name || 'Not Assigned'}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <Link
                  to={`/dashboard/students/${student._id}`}
                  className="text-blue-500 hover:text-blue-600 text-sm"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        ))}
        {students.length === 0 && (
          <p className="text-gray-500 col-span-3 text-center py-8">No students found.</p>
        )}
      </div>
    </div>
  );
};

export default StudentList;
