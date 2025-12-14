import React from 'react';
import { Link } from 'react-router-dom';
import { useGetSchoolsQuery, useDeleteSchoolMutation } from '../../api/schoolsApi';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Trash2, Eye, Edit } from 'lucide-react';

const SchoolList = () => {
  const { data: schools, isLoading, isError, error } = useGetSchoolsQuery();
  const [deleteSchool, { isLoading: isDeleting }] = useDeleteSchoolMutation();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this school? This will also delete the associated admin user.')) {
      try {
        await deleteSchool(id).unwrap();
      } catch (err) {
        console.error('Failed to delete school:', err);
        alert(`Failed to delete school: ${err.data?.message || err.error}`);
      }
    }
  };

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (isError) {
    return (
      <ErrorMessage>
        Error: {error.data?.message || error.error || 'Failed to load schools'}
      </ErrorMessage>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="Schools">
        <Link to="/dashboard/schools/create">
          <Button>Add School</Button>
        </Link>
      </PageHeader>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(schools?.data || []).map((school) => (
              <tr key={school._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {school.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {school.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {school.contactInfo.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {school.admin ? `${school.admin.firstName} ${school.admin.lastName}` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/dashboard/schools/${school._id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Eye size={18} />
                  </Link>
                  <Link
                    to={`/dashboard/schools/${school._id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(school._id)}
                    className="text-red-600 hover:text-red-900"
                    disabled={isDeleting}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchoolList;