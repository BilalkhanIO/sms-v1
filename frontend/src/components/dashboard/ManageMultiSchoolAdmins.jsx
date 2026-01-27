import React, { useState } from 'react';
import {
  useGetMultiSchoolAdminsQuery,
  useAssignMultiSchoolAdminMutation,
  useRemoveMultiSchoolAdminMutation,
} from '../../api/multiSchoolAdminApi';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

const ManageMultiSchoolAdmins = () => {
  const { toast } = useToast();
  const { data: admins, isLoading, isError, error } = useGetMultiSchoolAdminsQuery();
  const [assignAdmin, { isLoading: isAssigning }] = useAssignMultiSchoolAdminMutation();
  const [removeAdmin, { isLoading: isRemoving }] = useRemoveMultiSchoolAdminMutation();
  const [email, setEmail] = useState('');

  const handleAssignAdmin = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await assignAdmin({ email }).unwrap();
      toast({ title: 'Success', description: 'Multi-school admin assigned successfully.' });
      setEmail('');
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.data?.message || 'Failed to assign multi-school admin.',
      });
    }
  };

  const handleRemoveAdmin = async (userId) => {
    try {
      await removeAdmin({ userId }).unwrap();
      toast({ title: 'Success', description: 'Multi-school admin removed successfully.' });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.data?.message || 'Failed to remove multi-school admin.',
      });
    }
  };

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage>{error.data?.message || 'Failed to load admins'}</ErrorMessage>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Multi-School Admins</h2>
      <form onSubmit={handleAssignAdmin} className="flex gap-2 mb-4">
        <Input
          type="email"
          placeholder="New admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          {admins &&
            admins.map((admin) => (
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
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageMultiSchoolAdmins;
