import React, { useState, useEffect } from 'react';
import { useGetManagedUsersQuery, useCreateManagedUserMutation, useUpdateManagedUserMutation, useDeleteManagedUserMutation } from '../../api/multiSchoolAdminApi';
import { useGetMultiSchoolDashboardStatsQuery } from '../../api/multiSchoolAdminApi';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import UserForm from './UserForm';
import { useToast } from '../ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

const UserManagement = () => {
  const { data: users, isLoading, isError, error } = useGetManagedUsersQuery();
  const { data: schools } = useGetMultiSchoolDashboardStatsQuery();
  const [createUser, { isLoading: isCreating }] = useCreateManagedUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateManagedUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteManagedUserMutation();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!isFormOpen) {
      setSelectedUser(null);
    }
  }, [isFormOpen]);

  const handleCreateUser = async (data) => {
    try {
      await createUser(data).unwrap();
      toast({ title: 'User Created' });
      setIsFormOpen(false);
    } catch (err) {
      toast({ title: 'Error creating user', description: err.data?.message, variant: 'destructive' });
    }
  };

  const handleUpdateUser = async (data) => {
    try {
      await updateUser({ id: selectedUser._id, ...data }).unwrap();
      toast({ title: 'User Updated' });
      setIsFormOpen(false);
    } catch (err) {
      toast({ title: 'Error updating user', description: err.data?.message, variant: 'destructive' });
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id).unwrap();
      toast({ title: 'User Deleted' });
    } catch (err) {
      toast({ title: 'Error deleting user', description: err.data?.message, variant: 'destructive' });
    }
  };

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage>{error.data?.message || 'Failed to load users'}</ErrorMessage>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Manage Users</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>Create User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedUser ? 'Edit User' : 'Create User'}</DialogTitle>
            </DialogHeader>
            <UserForm
              onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
              defaultValues={selectedUser}
              schools={schools || []}
              isEditing={!!selectedUser}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>School</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users && users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.school?.name}</TableCell>
              <TableCell className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => { setSelectedUser(user); setIsFormOpen(true); }}>Edit</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteUser(user._id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserManagement;
