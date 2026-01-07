import React, { useState } from 'react';
import { useInviteSchoolAdminMutation } from '../../api/multiSchoolAdminApi';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';

const InviteAdmin = ({ schoolId }) => {
  const { toast } = useToast();
  const [inviteAdmin, { isLoading }] = useInviteSchoolAdminMutation();
  const [email, setEmail] = useState('');

  const handleInviteAdmin = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await inviteAdmin({ schoolId, email }).unwrap();
      toast({ title: 'Success', description: 'Invitation sent successfully.' });
      setEmail('');
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: err.data?.message || 'Failed to send invitation.' });
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Invite New Admin</h3>
      <form onSubmit={handleInviteAdmin} className="flex gap-2 mb-4">
        <Input
          type="email"
          placeholder="New admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Invitation'}
        </Button>
      </form>
    </div>
  );
};

export default InviteAdmin;
