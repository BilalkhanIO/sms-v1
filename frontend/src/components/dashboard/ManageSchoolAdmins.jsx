import React, { useState, useEffect } from 'react';
import {
  useGetSchoolAdminsQuery,
  useAssignSchoolAdminMutation,
  useRemoveSchoolAdminMutation,
} from '../../api/multiSchoolAdminApi';
import { useLazySearchUsersQuery } from '../../api/usersApi';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';
import { debounce } from 'lodash';

const ManageSchoolAdmins = ({ schoolId }) => {
  const { toast } = useToast();
  const { data: admins, isLoading, isError, error } = useGetSchoolAdminsQuery(schoolId);
  const [assignAdmin, { isLoading: isAssigning }] = useAssignSchoolAdminMutation();
  const [removeAdmin, { isLoading: isRemoving }] = useRemoveSchoolAdminMutation();
  const [searchUsers, { data: searchResults, isLoading: isSearching }] = useLazySearchUsersQuery();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const debouncedSearch = debounce((term) => {
    if (term) {
      searchUsers(term);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const handleAssignAdmin = async () => {
    if (!selectedUser) return;
    try {
      await assignAdmin({ schoolId, email: selectedUser.email }).unwrap();
      toast({ title: 'Success', description: 'Admin assigned successfully.' });
      setSelectedUser(null);
      setSearchTerm('');
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.data?.message || 'Failed to assign admin.',
      });
    }
  };

  const handleRemoveAdmin = async (adminId) => {
    try {
      await removeAdmin({ schoolId, adminId }).unwrap();
      toast({ title: 'Success', description: 'Admin removed successfully.' });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.data?.message || 'Failed to remove admin.',
      });
    }
  };

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage>{error.data?.message || 'Failed to load admins'}</ErrorMessage>;

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="Search for user to add as admin..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedUser(null);
          }}
        />
        {isSearching && <Spinner size="small" />}
        {searchResults && searchTerm && !selectedUser && (
          <ul className="border rounded-md mt-1 max-h-40 overflow-y-auto">
            {searchResults.map((user) => (
              <li
                key={user._id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedUser(user);
                  setSearchTerm(`${user.firstName} ${user.lastName} (${user.email})`);
                }}
              >
                {user.firstName} {user.lastName} ({user.email})
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button onClick={handleAssignAdmin} disabled={!selectedUser || isAssigning}>
        {isAssigning ? 'Assigning...' : 'Assign Selected User'}
      </Button>

      <h3 className="text-lg font-semibold mt-6 mb-2">Current Admins</h3>
      <ul className="space-y-2">
        {admins &&
          admins.map((admin) => (
            <li
              key={admin._id}
              className="flex justify-between items-center bg-gray-100 p-2 rounded"
            >
              <span>
                {admin.name} ({admin.email})
              </span>
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
