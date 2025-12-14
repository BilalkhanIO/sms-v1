import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetSchoolByIdQuery } from '../../api/schoolsApi';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import PageHeader from '../../components/common/PageHeader';
import { Edit } from 'lucide-react';

const SchoolDetails = () => {
  const { id: schoolId } = useParams();
  const { data: school, isLoading, isError, error } = useGetSchoolByIdQuery(schoolId);

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (isError) {
    return (
      <ErrorMessage>
        Error: {error.data?.message || error.error || 'Failed to load school details'}
      </ErrorMessage>
    );
  }

  if (!school) {
    return <ErrorMessage>School not found.</ErrorMessage>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title={school.name} backUrl="/dashboard/schools">
        <Link to={`/dashboard/schools/${school._id}/edit`}>
          <Edit className="inline-block mr-2" size={18} /> Edit School
        </Link>
      </PageHeader>

      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">School Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">School Name</p>
            <p className="text-lg text-gray-900">{school.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Address</p>
            <p className="text-lg text-gray-900">{school.address}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Contact Phone</p>
            <p className="text-lg text-gray-900">{school.contactInfo?.phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Contact Email</p>
            <p className="text-lg text-gray-900">{school.contactInfo?.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Status</p>
            <p className="text-lg text-gray-900">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  school.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : school.status === 'PENDING_APPROVAL'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {school.status}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Admin</p>
            <p className="text-lg text-gray-900">
              {school.admin ? `${school.admin.firstName} ${school.admin.lastName} (${school.admin.email})` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Created At</p>
            <p className="text-lg text-gray-900">{new Date(school.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Last Updated</p>
            <p className="text-lg text-gray-900">{new Date(school.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolDetails;