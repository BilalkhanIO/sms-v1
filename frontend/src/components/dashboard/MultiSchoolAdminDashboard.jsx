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

const MultiSchoolAdminDashboard = () => {
  const { data: stats, isLoading, isError, error } = useGetDashboardStatsQuery();

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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Multi-School Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats && stats.map((school) => (
          <div key={school.schoolId} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{school.schoolName}</h2>
            <p>Students: {school.studentCount}</p>
            <p>Teachers: {school.teacherCount}</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4">Manage Admins</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Admins for {school.schoolName}</DialogTitle>
                </DialogHeader>
                <ManageSchoolAdmins schoolId={school.schoolId} />
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiSchoolAdminDashboard;
