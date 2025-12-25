import React, { useState } from 'react';
import { useGetSchoolsQuery } from '../../api/schoolApi';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import SchoolList from '../schools/SchoolList';
import SchoolDetails from '../schools/SchoolDetails';

const MultiSchoolAdminDashboard = () => {
  const { data: schools, isLoading, isError, error } = useGetSchoolsQuery();
  const [selectedSchool, setSelectedSchool] = useState(null);

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Multi-School Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <SchoolList
            schools={schools || []}
            onSelectSchool={setSelectedSchool}
            selectedSchool={selectedSchool}
          />
        </div>
        <div className="md:col-span-2">
          <SchoolDetails school={selectedSchool} />
        </div>
      </div>
    </div>
  );
};

export default MultiSchoolAdminDashboard;
