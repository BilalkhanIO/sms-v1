import React, { useState } from 'react';
import { useGetSchoolAdminsQuery, useAssignSchoolAdminMutation, useRemoveSchoolAdminMutation } from '../../api/multiSchoolAdminApi';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';

const ManageSchoolAdmins = ({ schoolId }) => {
  const { data: admins, isLoading, isError, error } = useGetSchoolAdminsQuery(schoolId);
  const [assignAdmin, { isLoading: isAssigning }] = useAssignSchoolAdminMutation();
  const [removeAdmin, { isLoading: isRemoving }] = useRemoveSchoolAdminMutation();
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleAssignAdmin = async (e) => {
    e.preventDefault();
    try {
      await assignAdmin({ schoolId, email }).unwrap();
      toast({
        title: 'Success',
        description: 'Admin assigned successfully.',
      });
      setEmail('');
    } catch (err) {
      toast({
        title: 'Error',
        description: err.data?.message || 'Failed to assign admin.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveAdmin = async (adminId) => {
    try {
      await removeAdmin({ schoolId, adminId }).unwrap();
      toast({
        title: 'Success',
        description: 'Admin removed successfully.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.data?.message || 'Failed to remove admin.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage>Error: {error.data?.message || 'Failed to load admins'}</ErrorMessage>;

  return (
    <div>
      <form onSubmit={handleAssignAdmin} className="flex gap-2 mb-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter admin email"
          required
        />
        <Button type="submit" disabled={isAssigning}>
          {isAssigning ? 'Assigning...' : 'Assign Admin'}
        </Button>
      </form>

      <ul className="space-y-2">
        {admins && admins.map((admin) => (
          <li key={admin._id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
            <div>
              <p className="font-semibold">{admin.name}</p>
              <p className="text-sm text-gray-500">{admin.email}</p>
            </div>
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
