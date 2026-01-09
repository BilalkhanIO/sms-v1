import React, { useState } from 'react';
import { useGetSchoolAdminsQuery, useAssignSchoolAdminMutation, useRemoveSchoolAdminMutation } from '../../api/multiSchoolAdminApi';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import { useToast } from '../ui/use-toast';

const ManageSchoolAdmins = ({ schoolId }) => {
  const { data: admins, isLoading, isError, error } = useGetSchoolAdminsQuery(schoolId);
  const [assignSchoolAdmin, { isLoading: isAssigning }] = useAssignSchoolAdminMutation();
  const [removeSchoolAdmin, { isLoading: isRemoving }] = useRemoveSchoolAdminMutation();
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleAssignAdmin = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await assignSchoolAdmin({ schoolId, email }).unwrap();
      toast({
        title: 'Admin Assigned',
        description: `Successfully assigned ${email} as an admin.`,
      });
      setEmail('');
    } catch (err) {
      toast({
        title: 'Error Assigning Admin',
        description: err.data?.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveAdmin = async (adminId) => {
    try {
      await removeSchoolAdmin({ schoolId, adminId }).unwrap();
      toast({
        title: 'Admin Removed',
        description: 'Successfully removed the admin.',
      });
    } catch (err) {
      toast({
        title: 'Error Removing Admin',
        description: err.data?.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage>{error.data?.message || 'Failed to load admins'}</ErrorMessage>;

  return (
    <div>
      <form onSubmit={handleAssignAdmin} className="flex gap-2 mb-4">
        <Input
          type="email"
          placeholder="Enter admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={isAssigning}>
          {isAssigning ? 'Assigning...' : 'Assign'}
        </Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins && admins.map((admin) => (
            <TableRow key={admin._id}>
              <TableCell>{admin.name}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveAdmin(admin._id)}
                  disabled={isRemoving}
                >
                  {isRemoving ? 'Removing...' : 'Remove'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageSchoolAdmins;
