import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetSchoolDetailsQuery } from '../../api/dashboardApi';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import PageHeader from '../../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const SchoolDetailsDashboard = () => {
  const { schoolId } = useParams();
  const { data, isLoading, isError, error } = useGetSchoolDetailsQuery(schoolId);

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

  const { school, overview } = data || {};

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title={school?.name || 'School Details'} backUrl="/dashboard/schools" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{overview?.totalStudents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{overview?.totalTeachers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{overview?.totalClasses}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{overview?.activeUsers}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchoolDetailsDashboard;
