import React from 'react';
import { Link } from 'react-router-dom';
import { useGetManagedSchoolsQuery } from '../../api/multiSchoolAdminApi';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import CentralizedAdminManagement from '../../pages/admin/CentralizedAdminManagement';
import ManageMultiSchoolAdmins from './ManageMultiSchoolAdmins';

const MultiSchoolAdminDashboard = () => {
  const { data: schools, isLoading, isError, error } = useGetManagedSchoolsQuery();

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (isError) {
    return (
      <ErrorMessage>
        Error: {error.data?.message || error.error || 'Failed to load schools'}
      </ErrorMessage>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Multi-School Admin Dashboard</h1>
      <Tabs defaultValue="schools">
        <TabsList>
          <TabsTrigger value="schools">Managed Schools</TabsTrigger>
          <TabsTrigger value="admin-management">Admin Management</TabsTrigger>
          <TabsTrigger value="multi-school-admins">Multi-School Admins</TabsTrigger>
        </TabsList>
        <TabsContent value="schools">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schools && schools.map((school) => (
              <div key={school._id} className="bg-white p-4 rounded-lg shadow">
                <Link to={`/dashboard/schools/${school._id}`}>
                  <h2 className="text-xl font-semibold mb-2">{school.name}</h2>
                </Link>
                <p>Status: {school.status}</p>
                <p>Created At: {new Date(school.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="admin-management">
          <CentralizedAdminManagement />
        </TabsContent>
        <TabsContent value="multi-school-admins">
          <ManageMultiSchoolAdmins />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MultiSchoolAdminDashboard;
