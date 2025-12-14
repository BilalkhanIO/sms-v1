import React from 'react';
import { useGetUserRoleDistributionQuery } from '../../../api/dashboardApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Spinner from '../../common/Spinner';
import ErrorMessage from '../../common/ErrorMessage';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1942']; // Example colors

const UserRoleDistributionChart = () => {
  const { data: roleDistribution, isLoading, isError, error } = useGetUserRoleDistributionQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Role Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Spinner />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Role Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorMessage>Error loading user role data: {error.data?.message || error.error}</ErrorMessage>
        </CardContent>
      </Card>
    );
  }

  const chartData = roleDistribution?.map(item => ({
    name: item._id.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()), // Format role name
    value: item.count,
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Role Distribution</CardTitle>
        <CardDescription>Breakdown of users by their assigned roles.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No user role data available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserRoleDistributionChart;
