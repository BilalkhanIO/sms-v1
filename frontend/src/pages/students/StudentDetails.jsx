import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetStudentByIdQuery } from '../../api/studentApi';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';

const StudentDetails = () => {
  const { id } = useParams();
  const { data: student, isLoading, error } = useGetStudentByIdQuery(id);

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="Student Details" backUrl="/students">
        <Link to={`/students/${id}/edit`}>
          <Button>Edit Student</Button>
        </Link>
      </PageHeader>

      <div className="space-y-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-gray-600 text-sm font-medium">Admission Number</h4>
              <p className="text-gray-900">{student.admissionNumber}</p>
            </div>
            
            <div>
              <h4 className="text-gray-600 text-sm font-medium">Roll Number</h4>
              <p className="text-gray-900">{student.rollNumber}</p>
            </div>

            <div>
              <h4 className="text-gray-600 text-sm font-medium">Class</h4>
              <p className="text-gray-900">{student.class?.name} - {student.class?.section || 'N/A'}</p>
            </div>

            <div>
              <h4 className="text-gray-600 text-sm font-medium">Academic Year</h4>
              <p className="text-gray-900">{student.class?.academicYear || 'N/A'}</p>
            </div>

            <div>
              <h4 className="text-gray-600 text-sm font-medium">Date of Birth</h4>
              <p className="text-gray-900">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
            </div>

            <div>
              <h4 className="text-gray-600 text-sm font-medium">Gender</h4>
              <p className="text-gray-900">{student.gender}</p>
            </div>

            <div>
              <h4 className="text-gray-600 text-sm font-medium">Status</h4>
              <p className={`text-gray-900 ${
                student.status === 'ACTIVE' ? 'text-green-600' : 
                student.status === 'INACTIVE' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {student.status}
              </p>
            </div>
        </div>

        {student.parent && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Parent/Guardian Information</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-base font-medium text-gray-900">
                    {student.parent.firstName} {student.parent.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="text-base font-medium text-gray-900">
                    {student.parent.contactNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-base font-medium text-gray-900">
                    {student.parent.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Relationship</p>
                  <p className="text-base font-medium text-gray-900">
                    {student.parent.relationship}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {student.attendance && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance Overview</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Present Days</p>
                  <p className="text-xl font-medium text-green-600">
                    {student.attendance.presentDays}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Absent Days</p>
                  <p className="text-xl font-medium text-red-600">
                    {student.attendance.absentDays}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Attendance Rate</p>
                  <p className="text-xl font-medium text-blue-600">
                    {student.attendance.rate}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default StudentDetails; 