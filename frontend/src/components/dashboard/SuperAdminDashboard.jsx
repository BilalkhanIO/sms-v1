import React from 'react';
import { useGetSuperAdminStatsQuery, useGetUserRoleDistributionQuery } from '../../api/dashboardApi';
import { useGetActivityLogsQuery } from '../../api/activityLogsApi';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import { ResponsiveContainer, PieChart, Pie, Tooltip } from 'recharts';

const SuperAdminDashboard = () => {
  const { data, isLoading, isError, error } = useGetSuperAdminStatsQuery();

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
    activeUsers,
    todayAttendance,
    feeSummary,
  } = data?.overview || {};
  const { data: userRoleDistribution } = useGetUserRoleDistributionQuery();
  const { data: recentActivities } = useGetActivityLogsQuery({ limit: 5 });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-600">Total Schools</h2>
          <p className="text-3xl font-bold">{totalSchools}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-600">Total Students</h2>
          <p className="text-3xl font-bold">{totalStudents}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-600">Total Teachers</h2>
          <p className="text-3xl font-bold">{totalTeachers}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-600">Total Classes</h2>
          <p className="text-3xl font-bold">{totalClasses}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">User Role Distribution</h2>
          <div className="p-4 bg-white rounded-lg shadow h-80">
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
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
          <div className="p-4 bg-white rounded-lg shadow">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
