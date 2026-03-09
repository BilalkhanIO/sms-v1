import React from 'react';
import { useGetDashboardStatsQuery } from '../../api/multiSchoolAdminApi';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import ManageSchoolAdmins from './ManageSchoolAdmins';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { PlusCircle } from 'lucide-react';

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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Multi-School Admin Dashboard</h1>
        <Button asChild>
          <Link to="/dashboard/admin/manage-admins">
            <PlusCircle className="mr-2 h-4 w-4" />
            Manage All Admins
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats &&
          stats.map((school) => (
            <div key={school.schoolId} className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">{school.schoolName}</h2>
              <p>Students: {school.studentCount}</p>
              <p>Teachers: {school.teacherCount}</p>
              <div className="flex justify-between mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Manage Admins</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Admins for {school.schoolName}</DialogTitle>
                    </DialogHeader>
                    <ManageSchoolAdmins schoolId={school.schoolId} />
                  </DialogContent>
                </Dialog>
                <Button asChild>
                  <Link to={`/dashboard/schools/${school.schoolId}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MultiSchoolAdminDashboard;
