import React, { useState } from 'react';
import { useGetSchoolAdminsQuery, useAssignSchoolAdminMutation, useRemoveSchoolAdminMutation } from '../../api/multiSchoolAdminApi';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';

const ManageSchoolAdmins = ({ schoolId }) => {
  const { toast } = useToast();
  const { data: admins, isLoading, isError, error } = useGetSchoolAdminsQuery(schoolId);
  const [assignAdmin, { isLoading: isAssigning }] = useAssignSchoolAdminMutation();
  const [removeAdmin, { isLoading: isRemoving }] = useRemoveSchoolAdminMutation();
  const [email, setEmail] = useState('');

  const handleAssignAdmin = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await assignAdmin({ schoolId, email }).unwrap();
      toast({ title: 'Success', description: 'Admin assigned successfully.' });
      setEmail('');
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: err.data?.message || 'Failed to assign admin.' });
    }
  };

  const handleRemoveAdmin = async (adminId) => {
    try {
      await removeAdmin({ schoolId, adminId }).unwrap();
      toast({ title: 'Success', description: 'Admin removed successfully.' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: err.data?.message || 'Failed to remove admin.' });
    }
  };

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage>{error.data?.message || 'Failed to load admins'}</ErrorMessage>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Manage School Admins</h3>
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
      <ul className="space-y-2">
        {admins && admins.map((admin) => (
          <li key={admin._id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
            <span>{admin.name} ({admin.email})</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleRemoveAdmin(admin._id)}
              disabled={isRemoving}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageSchoolAdmins;
