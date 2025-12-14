import React from 'react';
import { useGetSchoolStatusDistributionQuery } from '../../../api/dashboardApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Spinner from '../../common/Spinner';
import ErrorMessage from '../../common/ErrorMessage';

const COLORS = ['#A8E6CF', '#FFD3B5', '#FFAAA5']; // Example colors for statuses

const SchoolStatusDistributionChart = () => {
  const { data: statusDistribution, isLoading, isError, error } = useGetSchoolStatusDistributionQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>School Status Distribution</CardTitle>
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
          <CardTitle>School Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorMessage>Error loading school status data: {error.data?.message || error.error}</ErrorMessage>
        </CardContent>
      </Card>
    );
  }

  const chartData = statusDistribution?.map(item => ({
    name: item._id.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()), // Format status name
    value: item.count,
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>School Status Distribution</CardTitle>
        <CardDescription>Breakdown of schools by their operational status.</CardDescription>
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
            <p className="text-muted-foreground">No school status data available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SchoolStatusDistributionChart;
