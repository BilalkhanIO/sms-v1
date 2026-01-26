import React, { useState } from 'react';
import { useGetMultiSchoolAdminsQuery, useAssignMultiSchoolAdminMutation, useRemoveMultiSchoolAdminMutation } from '../../api/multiSchoolAdminApi';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const ManageMultiSchoolAdmins = () => {
  const { data: admins, isLoading, isError, error } = useGetMultiSchoolAdminsQuery();
  const [assignAdmin, { isLoading: isAssigning }] = useAssignMultiSchoolAdminMutation();
  const [removeAdmin, { isLoading: isRemoving }] = useRemoveMultiSchoolAdminMutation();
  const [email, setEmail] = useState('');

  const handleAssign = async () => {
    if (email) {
      await assignAdmin(email);
      setEmail('');
    }
  };

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (isError) {
    return (
      <ErrorMessage>
        Error: {error.data?.message || error.error || 'Failed to load admins'}
      </ErrorMessage>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Multi-School Admins</h2>
      <div className="flex gap-2 mb-4">
        <Input
          type="email"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleAssign} disabled={isAssigning}>
          {isAssigning ? 'Assigning...' : 'Assign Admin'}
        </Button>
      </div>
      <div>
        {admins && admins.map((admin) => (
          <div key={admin._id} className="flex justify-between items-center p-2 border-b">
            <div>
              <p className="font-semibold">{admin.name}</p>
              <p className="text-sm text-gray-500">{admin.email}</p>
            </div>
            <Button
              variant="destructive"
              onClick={() => removeAdmin(admin._id)}
              disabled={isRemoving}
            >
              {isRemoving ? 'Removing...' : 'Remove'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageMultiSchoolAdmins;
