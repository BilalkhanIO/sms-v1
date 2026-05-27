import { Link } from 'react-router-dom';
import { useGetDashboardStatsQuery } from '../../api/multiSchoolAdminApi';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import ManageSchoolAdmins from './ManageSchoolAdmins';
import ManageMultiSchoolAdmins from './ManageMultiSchoolAdmins';
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Multi-School Admin Dashboard</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats && stats.map((school) => (
          <div key={school.schoolId} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{school.schoolName}</h2>
            <p>Students: {school.studentCount}</p>
            <p>Teachers: {school.teacherCount}</p>
            <div className="mt-4 flex gap-2">
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
              <Link to={`/schools/${school.schoolId}/dashboard`}>
                <Button variant="outline">View Details</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiSchoolAdminDashboard;
