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
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
    <h1 className="text-4xl font-extrabold mb-8 text-gray-800 border-b-2 pb-2">Multi-School Admin Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {stats && stats.map((school) => (
        <div key={school.schoolId} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{school.schoolName}</h2>
            <span className="text-sm font-semibold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">ID: {school.schoolId}</span>
          </div>
          <div className="space-y-3 text-gray-700">
            <p className="flex justify-between"><strong>Students:</strong> <span className="font-mono text-lg">{school.studentCount}</span></p>
            <p className="flex justify-between"><strong>Teachers:</strong> <span className="font-mono text-lg">{school.teacherCount}</span></p>
          </div>
          <div className="mt-6 flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                  Manage Admins
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Admins for {school.schoolName}</DialogTitle>
                </DialogHeader>
                <ManageSchoolAdmins schoolId={school.schoolId} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

export default MultiSchoolAdminDashboard;
