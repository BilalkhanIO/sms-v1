import React from 'react';
import { useGetDashboardStatsQuery } from '../../api/multiSchoolAdminApi';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import ManageSchoolAdmins from './ManageSchoolAdmins';
import ManageMultiSchoolAdmins from './ManageMultiSchoolAdmins';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Users, Building, School as SchoolIcon } from 'lucide-react';

const MultiSchoolAdminDashboard = () => {
  const { data: stats, isLoading, isError, error } = useGetDashboardStatsQuery();

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Spinner size="large" /></div>;
  }

  if (isError) {
    return (
      <ErrorMessage>
        Error: {error.data?.message || error.error || 'Failed to load dashboard stats'}
      </ErrorMessage>
    );
  }

  const totalSchools = stats?.length || 0;
  const totalStudents = stats?.reduce((acc, school) => acc + school.studentCount, 0) || 0;
  const totalTeachers = stats?.reduce((acc, school) => acc + school.teacherCount, 0) || 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Multi-School Admin Dashboard</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Manage System Admins</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Multi-School System Admins</DialogTitle>
            </DialogHeader>
            <ManageMultiSchoolAdmins />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSchools}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <SchoolIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeachers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>School Population Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="schoolName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="studentCount" fill="#8884d8" name="Students" />
              <Bar dataKey="teacherCount" fill="#82ca9d" name="Teachers" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* School List */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Managed Schools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats && stats.map((school) => (
            <Card key={school.schoolId} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{school.schoolName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{school.studentCount} Students</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <SchoolIcon className="h-4 w-4 mr-2" />
                  <span>{school.teacherCount} Teachers</span>
                </div>
                <div className="mt-6 flex gap-2 justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">Manage Admins</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Admins for {school.schoolName}</DialogTitle>
                      </DialogHeader>
                      <ManageSchoolAdmins schoolId={school.schoolId} />
                    </DialogContent>
                  </Dialog>
                  <Link to={`/dashboard/schools/${school.schoolId}`}>
                    <Button size="sm" variant="outline">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiSchoolAdminDashboard;
