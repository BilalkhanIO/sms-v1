import React from 'react';
import { useGetSuperAdminStatsQuery, useGetUserRoleDistributionQuery } from '../../api/dashboardApi';
import { useGetActivityLogsQuery } from '../../api/activityLogsApi';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = ['#0049B7', '#00DDFF', '#ff1d58', '#f75990', '#fff685'];

const SuperAdminDashboard = () => {
  const { data, isLoading, isError, error } = useGetSuperAdminStatsQuery();
  const { data: userRoleDistribution } = useGetUserRoleDistributionQuery();
  const { data: recentActivities } = useGetActivityLogsQuery({ limit: 5 });

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (isError) {
    return (
      <ErrorMessage>
        Error: {error.data?.message || error.error || 'Failed to load dashboard data'}
      </ErrorMessage>
    );
  }

  const {
    totalSchools,
    totalStudents,
    totalTeachers,
    totalClasses,
  } = data?.overview || {};

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-brutal-blue">Super Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sister-sister">Total Schools</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalSchools}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sister-sister">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalStudents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sister-sister">Total Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalTeachers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sister-sister">Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalClasses}</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-brutal-blue">User Role Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userRoleDistribution}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {userRoleDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-brutal-blue">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {recentActivities?.data.map((activity) => (
                <li key={activity._id} className="border-b last:border-b-0 py-2">
                  <p className="font-semibold">{activity.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
