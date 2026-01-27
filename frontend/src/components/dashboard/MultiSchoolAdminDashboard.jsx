import React from 'react';
import { useGetManagedSchoolsQuery } from '../../api/multiSchoolAdminApi';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import CentralizedAdminManagement from '../../pages/admin/CentralizedAdminManagement';
import ManageMultiSchoolAdmins from './ManageMultiSchoolAdmins';
import { Link } from 'react-router-dom';

const MultiSchoolAdminDashboard = () => {
  const { data: schools, isLoading, isError, error } = useGetManagedSchoolsQuery();

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (isError) {
    return (
      <ErrorMessage>
        Error: {error.data?.message || 'Failed to load dashboard data'}
      </ErrorMessage>
    );
  }

  const totalStudents = schools?.reduce((acc, school) => acc + school.studentCount, 0) || 0;
  const totalTeachers = schools?.reduce((acc, school) => acc + school.teacherCount, 0) || 0;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Multi-School Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Managed Schools</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{schools?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalStudents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalTeachers}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="userManagement">User Management</TabsTrigger>
          <TabsTrigger value="adminManagement">Admin Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Your Schools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schools?.map((school) => (
                  <Link to={`/dashboard/schools/${school._id}`} key={school._id}>
                    <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                      <h3 className="text-xl font-semibold mb-2">{school.name}</h3>
                      <p>Status: {school.status}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="userManagement">
          <CentralizedAdminManagement />
        </TabsContent>

        <TabsContent value="adminManagement">
          <ManageMultiSchoolAdmins />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MultiSchoolAdminDashboard;
