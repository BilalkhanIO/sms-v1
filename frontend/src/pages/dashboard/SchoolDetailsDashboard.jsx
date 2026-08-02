import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetSchoolDetailsQuery } from '../../api/multiSchoolAdminApi';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const SchoolDetailsDashboard = () => {
  const { schoolId } = useParams();
  const { data: schoolDetails, isLoading, isError, error } = useGetSchoolDetailsQuery(schoolId);

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (isError) {
    return (
      <ErrorMessage>
        Error: {error.data?.message || 'Failed to load school details'}
      </ErrorMessage>
    );
  }

  if (!schoolDetails) {
    return <div>No school details found.</div>;
  }

  const { school, overview, recentExams } = schoolDetails?.data || schoolDetails || {};

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{school?.name} - Detailed Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">School Information</h2>
          <p><strong>Address:</strong> {school?.address || '—'}</p>
          <p><strong>Email:</strong> {school?.email || '—'}</p>
          <p><strong>Phone:</strong> {school?.phone || '—'}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Statistics</h2>
          <p><strong>Students:</strong> {overview?.totalStudents ?? '—'}</p>
          <p><strong>Teachers:</strong> {overview?.totalTeachers ?? '—'}</p>
          <p><strong>Classes:</strong> {overview?.totalClasses ?? '—'}</p>
          <p><strong>Active Users:</strong> {overview?.activeUsers ?? '—'}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Fee Summary</h2>
          <p><strong>Total Billed:</strong> ${overview?.feeSummary?.totalAmount?.toFixed(2) ?? '—'}</p>
          <p><strong>Total Paid:</strong> ${overview?.feeSummary?.totalPaid?.toFixed(2) ?? '—'}</p>
          <p><strong>Pending:</strong> ${overview?.feeSummary?.pending?.toFixed(2) ?? '—'}</p>
        </div>
      </div>
    </div>
  );
};

export default SchoolDetailsDashboard;
