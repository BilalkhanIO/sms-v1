import React from 'react';
import { useGetDashboardStatsQuery } from '../../api/multiSchoolAdminApi';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import ManageSchoolAdmins from './ManageSchoolAdmins';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const MultiSchoolAdminDashboard = () => {
  const { data: stats, isLoading, isError, error } = useGetDashboardStatsQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (isError) {
    return (
      <ErrorMessage>
        Error: {error.data?.message || error.error || 'Failed to load dashboard stats'}
      </ErrorMessage>
    );
  }

  const chartData =
    stats?.map((school) => ({
      name: school.schoolName,
      Students: school.studentCount,
      Teachers: school.teacherCount,
    })) || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Multi-School Admin Dashboard</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>School Comparison</CardTitle>
          <CardDescription>Student and Teacher counts across your schools</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Students" fill="#8884d8" />
              <Bar dataKey="Teachers" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats &&
          stats.map((school) => (
            <Card key={school.schoolId} className="flex flex-col">
              <CardHeader>
                <CardTitle>{school.schoolName}</CardTitle>
                <CardDescription>ID: {school.schoolId}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>
                  <strong>Students:</strong> {school.studentCount}
                </p>
                <p>
                  <strong>Teachers:</strong> {school.teacherCount}
                </p>
                <p>
                  <strong>Total Income:</strong> ${school.totalIncome.toLocaleString()}
                </p>
                <p>
                  <strong>Avg. Attendance:</strong> {school.averageAttendance}%
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={() => navigate(`/school/${school.schoolId}`)}>
                  View Details
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Manage Admins</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Admins for {school.schoolName}</DialogTitle>
                    </DialogHeader>
                    <ManageSchoolAdmins schoolId={school.schoolId} />
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default MultiSchoolAdminDashboard;
