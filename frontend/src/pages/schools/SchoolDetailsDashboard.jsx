import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetSchoolByIdQuery } from '../../api/schoolsApi';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import PageHeader from '../../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const SchoolDetailsDashboard = () => {
  const { id: schoolId } = useParams();
  const { data: schoolData, isLoading, isError, error } = useGetSchoolByIdQuery(schoolId);

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

  const { school, overview } = schoolData?.data || {};

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title={school?.name || 'School Details'} backUrl="/dashboard/schools" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{overview?.students}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{overview?.teachers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{overview?.classes}</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>School Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{school?.status}</p>
          </CardContent>
        </Card>
      </div>
      {/* TODO: Add more detailed components for users, classes, etc. */}
    </div>
  );
};

export default SchoolDetailsDashboard;
