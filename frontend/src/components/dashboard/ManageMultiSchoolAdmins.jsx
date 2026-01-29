import React, { useState } from 'react';
import { useGetMultiSchoolAdminsQuery, useAssignMultiSchoolAdminMutation, useRemoveMultiSchoolAdminMutation } from '../../api/multiSchoolAdminApi';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'react-hot-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

const ManageMultiSchoolAdmins = () => {
  const { data: admins, isLoading, isError, error, refetch } = useGetMultiSchoolAdminsQuery();
  const [assignAdmin, { isLoading: isAssigning }] = useAssignMultiSchoolAdminMutation();
  const [removeAdmin, { isLoading: isRemoving }] = useRemoveMultiSchoolAdminMutation();
  const [email, setEmail] = useState('');

  const handleAssignAdmin = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await assignAdmin({ email }).unwrap();
      toast.success('Admin assigned successfully');
      setEmail('');
      refetch();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to assign admin');
    }
  };

  const [adminToRemove, setAdminToRemove] = useState(null);

  const handleRemoveAdmin = async () => {
    if (!adminToRemove) return;
    try {
      await removeAdmin(adminToRemove).unwrap();
      toast.success('Admin removed successfully');
      refetch();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to remove admin');
    } finally {
      setAdminToRemove(null);
    }
  };

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage message={error.data?.message || 'Failed to load admins'} />;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Multi-School Admins</h2>
      <form onSubmit={handleAssignAdmin} className="flex gap-2 mb-4">
        <Input
          type="email"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={isAssigning}>
          {isAssigning ? 'Assigning...' : 'Assign Admin'}
        </Button>
      </form>
      <div className="space-y-2">
        {admins && admins.map((admin) => (
          <div key={admin._id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <div>
              <p className="font-semibold">{admin.name}</p>
              <p className="text-sm text-gray-600">{admin.email}</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setAdminToRemove(admin._id)}
              disabled={isRemoving}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      <AlertDialog open={!!adminToRemove} onOpenChange={() => setAdminToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the admin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveAdmin}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageMultiSchoolAdmins;
