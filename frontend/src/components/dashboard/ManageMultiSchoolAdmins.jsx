import { useState } from 'react';
import { useGetMultiSchoolAdminsQuery, useAssignMultiSchoolAdminMutation, useRemoveMultiSchoolAdminMutation } from '../../api/multiSchoolAdminApi';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';

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
      toast({ variant: 'destructive', title: 'Error', description: err.data?.message || 'Failed to assign multi-school admin.' });
    }
  };

  const handleRemoveAdmin = async (adminId) => {
    try {
      await removeAdmin(adminId).unwrap();
      toast({ title: 'Success', description: 'Multi-school admin removed successfully.' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: err.data?.message || 'Failed to remove multi-school admin.' });
    }
  };

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage>{error.data?.message || 'Failed to load multi-school admins'}</ErrorMessage>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Manage Multi-School Admins</h3>
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

export default ManageMultiSchoolAdmins;
