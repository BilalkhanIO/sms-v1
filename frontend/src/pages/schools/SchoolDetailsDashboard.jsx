import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetSchoolDetailsQuery } from '../../api/multiSchoolAdminApi';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

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

  const {
    schoolName,
    studentCount,
    teacherCount,
    classCount,
    averageAttendance,
    revenue,
    expenses,
    genderDistribution,
  } = schoolDetails || {};

  const financialData = [
    { name: 'Revenue', value: revenue },
    { name: 'Expenses', value: expenses },
    { name: 'Profit', value: revenue - expenses },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{schoolName} - Detailed Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{studentCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{teacherCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{classCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg. Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{averageAttendance}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={financialData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Student Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={300}>
              <BarChart data={genderDistribution}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchoolDetailsDashboard;
