import React from 'react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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

      <div>
        <h2 className="text-xl font-semibold mb-3">Managed Schools Overview</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>School Name</TableHead>
                <TableHead className="text-center">Students</TableHead>
                <TableHead className="text-center">Teachers</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats && stats.map((school) => (
                <TableRow key={school.schoolId}>
                  <TableCell className="font-medium">{school.schoolName}</TableCell>
                  <TableCell className="text-center">{school.studentCount}</TableCell>
                  <TableCell className="text-center">{school.teacherCount}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">Manage Admins</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Admins for {school.schoolName}</DialogTitle>
                        </DialogHeader>
                        <ManageSchoolAdmins schoolId={school.schoolId} />
                      </DialogContent>
                    </Dialog>
                    <Button asChild size="sm">
                      <Link to={`/schools/${school.schoolId}`}>View Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default MultiSchoolAdminDashboard;
