import React from 'react';
import { useGetSchoolsQuery } from '../../api/schoolApi';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import SchoolList from '../../pages/schools/SchoolList';

const MultiSchoolAdminDashboard = () => {
  console.log("Rendering MultiSchoolAdminDashboard");
  const { data: schools, isLoading, isError, error } = useGetSchoolsQuery();

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
    <div>
      <h1 className="text-2xl font-bold mb-4">Multi-School Admin Dashboard</h1>
      <SchoolList schools={schools} />
    </div>
  );
};

export default MultiSchoolAdminDashboard;
