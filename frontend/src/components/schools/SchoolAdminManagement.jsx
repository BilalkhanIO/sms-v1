import React, { useState } from 'react';
import { useGetUsersQuery, useCreateUserMutation, useDeleteUserMutation } from '../../api/usersApi';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import AssignAdminForm from './AssignAdminForm';

const SchoolAdminManagement = ({ school }) => {
  const { data: users, isLoading, isError, error } = useGetUsersQuery({ schoolId: school._id, role: 'SCHOOL_ADMIN' });
  const [createUser] = useCreateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);

  const handleAssignAdmin = async (values) => {
    try {
      await createUser({ ...values, school: school._id, role: 'SCHOOL_ADMIN' }).unwrap();
      setIsAddAdminOpen(false);
    } catch (err) {
      console.error('Failed to create admin:', err);
    }
  };

  const handleRemoveAdmin = async (userId) => {
    try {
      await deleteUser(userId).unwrap();
    } catch (err) {
      console.error('Failed to delete admin:', err);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <ErrorMessage message={error.data?.message || 'Failed to load admins.'} />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>School Admins</CardTitle>
        <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
          <DialogTrigger asChild>
            <Button>Add Admin</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign New Admin to {school.name}</DialogTitle>
            </DialogHeader>
            <AssignAdminForm schoolId={school._id} onSubmit={handleAssignAdmin} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => handleRemoveAdmin(user._id)}>
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SchoolAdminManagement;
