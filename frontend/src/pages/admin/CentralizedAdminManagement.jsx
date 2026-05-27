import React, { useState } from 'react';
import { useGetAllManagedUsersQuery, useAssignSchoolAdminMutation, useRemoveSchoolAdminMutation } from '../../api/multiSchoolAdminApi';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

const CentralizedAdminManagement = () => {
  const { data: users, isLoading, isError, error } = useGetAllManagedUsersQuery();
  const [assignAdmin, { isLoading: isAssigning }] = useAssignSchoolAdminMutation();
  const [removeAdmin, { isLoading: isRemoving }] = useRemoveSchoolAdminMutation();
  const [email, setEmail] = useState('');
  const [schoolId, setSchoolId] = useState('');

  const handleAssign = async () => {
    if (email && schoolId) {
      await assignAdmin({ schoolId, email });
      setEmail('');
      setSchoolId('');
    }
  };

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (isError) {
    return (
      <ErrorMessage>
        Error: {error.data?.message || error.error || 'Failed to load users'}
      </ErrorMessage>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Centralized Admin Management</h2>
      <div className="flex gap-2 mb-4">
        <Input
          type="email"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Enter school ID"
          value={schoolId}
          onChange={(e) => setSchoolId(e.target.value)}
        />
        <Button onClick={handleAssign} disabled={isAssigning}>
          {isAssigning ? 'Assigning...' : 'Assign Admin'}
        </Button>
      </div>
      <div>
        {users && users.map((user) => (
          <div key={user._id} className="flex justify-between items-center p-2 border-b">
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500">Role: {user.role}</p>
            </div>
            {user.role === 'SCHOOL_ADMIN' && (
              <Button
                variant="destructive"
                onClick={() => removeAdmin({ schoolId: user.school, adminId: user._id })}
                disabled={isRemoving}
              >
                {isRemoving ? 'Removing...' : 'Remove Admin'}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CentralizedAdminManagement;
