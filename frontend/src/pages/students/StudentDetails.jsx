import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetStudentByIdQuery } from '../../api/studentApi';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import { Edit, User, MapPin } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const StudentDetails = () => {
  const { id } = useParams();
  const { can } = useAuth();
  const { data, isLoading, error } = useGetStudentByIdQuery(id);

  if (isLoading) return <Spinner size="large" />;
  if (error || !data) {
    return <div className="text-red-500 p-4">Error: {error?.data?.message || 'Failed to load student.'}</div>;
  }

  const student = data?.data || data;

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="Student Details" backUrl="/dashboard/students">
        {can('students', 'edit') && (
          <Link to={`/dashboard/students/update/${id}`}>
            <Button variant="secondary">
              <Edit className="w-4 h-4 mr-2" />
              Edit Student
            </Button>
          </Link>
        )}
      </PageHeader>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Basic Information */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {`${student.user?.firstName ?? ''} ${student.user?.lastName ?? ''}`.trim() || '—'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Admission Number</p>
              <p className="font-medium text-gray-900">{student.admissionNumber || '—'}</p>
            </div>
            <div>
              <p className="text-gray-500">Roll Number</p>
              <p className="font-medium text-gray-900">{student.rollNumber || '—'}</p>
            </div>
            <div>
              <p className="text-gray-500">Class</p>
              <p className="font-medium text-gray-900">
                {student.class?.name
                  ? `${student.class.name}${student.class.section ? ` — ${student.class.section}` : ''}`
                  : '—'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{student.user?.email || '—'}</p>
            </div>
            <div>
              <p className="text-gray-500">Date of Birth</p>
              <p className="font-medium text-gray-900">
                {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '—'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Gender</p>
              <p className="font-medium text-gray-900">{student.gender || '—'}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <p className={`font-medium ${
                student.status === 'ACTIVE' ? 'text-green-600' :
                student.status === 'INACTIVE' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {student.status || '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Parent / Guardian */}
        {student.parentInfo?.guardian && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-gray-400" /> Guardian
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {student.parentInfo.father?.name && (
                <div>
                  <p className="text-gray-500">Father</p>
                  <p className="font-medium text-gray-900">{student.parentInfo.father.name}</p>
                  {student.parentInfo.father.contact && (
                    <p className="text-gray-400 text-xs">{student.parentInfo.father.contact}</p>
                  )}
                </div>
              )}
              {student.parentInfo.mother?.name && (
                <div>
                  <p className="text-gray-500">Mother</p>
                  <p className="font-medium text-gray-900">{student.parentInfo.mother.name}</p>
                  {student.parentInfo.mother.contact && (
                    <p className="text-gray-400 text-xs">{student.parentInfo.mother.contact}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Address */}
        {student.address && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-400" /> Address
            </h3>
            <p className="text-sm text-gray-700">
              {[student.address.street, student.address.city, student.address.state, student.address.postalCode, student.address.country]
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetails;
