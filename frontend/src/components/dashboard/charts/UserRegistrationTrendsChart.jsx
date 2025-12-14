import React from 'react';
import { useGetUserRegistrationTrendsQuery } from '../../../api/dashboardApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Spinner from '../../common/Spinner';
import ErrorMessage from '../../common/ErrorMessage';

const UserRegistrationTrendsChart = () => {
  const { data: registrationTrends, isLoading, isError, error } = useGetUserRegistrationTrendsQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Registration Trends</CardTitle>
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
          <CardTitle>User Registration Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorMessage>Error loading registration data: {error.data?.message || error.error}</ErrorMessage>
        </CardContent>
      </Card>
    );
  }

  // Format data for Recharts: combine year and month into a readable string
  const chartData = registrationTrends?.map(item => ({
    name: `${item._id.month}/${item._id.year}`, // e.g., "1/2023"
    "New Registrations": item.count,
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Registration Trends</CardTitle>
        <CardDescription>New user registrations over the last 12 months.</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="New Registrations" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No registration data available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserRegistrationTrendsChart;
