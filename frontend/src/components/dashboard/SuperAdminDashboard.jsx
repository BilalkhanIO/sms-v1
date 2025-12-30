import React from 'react';
import {
  useGetSuperAdminStatsQuery,
  useGetUserRoleDistributionQuery,
  useGetUserStatusDistributionQuery,
  useGetSchoolStatusDistributionQuery,
  useGetUserRegistrationTrendsQuery,
} from '../../api/dashboardApi';
import { useGetActivityLogsQuery } from '../../api/activityLogsApi';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import PieChartComponent from '../common/PieChartComponent';

const SuperAdminDashboard = () => {
  const { data, isLoading, isError, error } = useGetSuperAdminStatsQuery();
  const { data: userRoleDistribution } = useGetUserRoleDistributionQuery();
  const { data: userStatusDistribution } = useGetUserStatusDistributionQuery();
  const { data: schoolStatusDistribution } = useGetSchoolStatusDistributionQuery();
  const { data: userRegistrationTrends } = useGetUserRegistrationTrendsQuery();
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <PieChartComponent
          title="User Role Distribution"
          data={userRoleDistribution}
          dataKey="count"
          nameKey="_id"
        />
        <PieChartComponent
          title="User Status Distribution"
          data={userStatusDistribution}
          dataKey="count"
          nameKey="_id"
        />
        <PieChartComponent
          title="School Status Distribution"
          data={schoolStatusDistribution}
          dataKey="count"
          nameKey="_id"
        />
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
          <div className="p-4 bg-white rounded-lg shadow h-80 overflow-y-auto">
            <ul>
              {recentActivities?.data?.map((activity) => (
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
      <div>
        <h2 className="text-xl font-bold mb-4">User Registration Trends (Last 12 Months)</h2>
        <div className="p-4 bg-white rounded-lg shadow h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={userRegistrationTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id.month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Registrations" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
