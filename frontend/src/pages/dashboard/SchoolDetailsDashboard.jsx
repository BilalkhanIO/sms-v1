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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{schoolDetails.schoolName} - Detailed Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">School Information</h2>
          <p><strong>Address:</strong> {schoolDetails.address}</p>
          <p><strong>Email:</strong> {schoolDetails.email}</p>
          <p><strong>Phone:</strong> {schoolDetails.phone}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Statistics</h2>
          <p><strong>Students:</strong> {schoolDetails.studentCount}</p>
          <p><strong>Teachers:</strong> {schoolDetails.teacherCount}</p>
        </div>
        {/* Add more detailed components here, e.g., for class schedules, financials, etc. */}
      </div>
    </div>
  );
};

export default SchoolDetailsDashboard;
