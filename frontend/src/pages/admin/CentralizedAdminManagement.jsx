import React from 'react';
import { useGetDashboardStatsQuery } from '../../api/multiSchoolAdminApi';
import ManageSchoolAdmins from '../../components/dashboard/ManageSchoolAdmins';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const CentralizedAdminManagement = () => {
  const { data: schools, isLoading, isError, error } = useGetDashboardStatsQuery();

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (isError) {
    return (
      <ErrorMessage>
        Error: {error.data?.message || 'Failed to load schools'}
      </ErrorMessage>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Centralized Admin Management</h1>
      <div className="space-y-6">
        {schools && schools.map((school) => (
          <div key={school.schoolId} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{school.schoolName}</h2>
            <ManageSchoolAdmins schoolId={school.schoolId} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CentralizedAdminManagement;
