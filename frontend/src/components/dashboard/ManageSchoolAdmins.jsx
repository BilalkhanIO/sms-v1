import React, { useState, useMemo } from 'react';
import { useGetSchoolAdminsQuery, useAssignSchoolAdminMutation, useRemoveSchoolAdminMutation } from '../../api/multiSchoolAdminApi';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '../ui/dialog';

const ManageSchoolAdmins = ({ schoolId }) => {
  const { toast } = useToast();
  const { data: admins, isLoading, isError, error } = useGetSchoolAdminsQuery(schoolId);
  const [assignAdmin, { isLoading: isAssigning }] = useAssignSchoolAdminMutation();
  const [removeAdmin, { isLoading: isRemoving }] = useRemoveSchoolAdminMutation();
  const [email, setEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const adminsPerPage = 5;

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

  const filteredAdmins = useMemo(() => {
    return (admins || []).filter(admin =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [admins, searchTerm]);

  const paginatedAdmins = useMemo(() => {
    const startIndex = (currentPage - 1) * adminsPerPage;
    return filteredAdmins.slice(startIndex, startIndex + adminsPerPage);
  }, [filteredAdmins, currentPage]);

  const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage>{error.data?.message || 'Failed to load admins'}</ErrorMessage>;

  return (
    <div>
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

      <Input
        type="text"
        placeholder="Search admins..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="mb-4"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedAdmins.map((admin) => (
            <TableRow key={admin._id}>
              <TableCell>{admin.name}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={isRemoving}>
                      Remove
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                      <DialogDescription>
                        This will permanently remove {admin.name} as an admin for this school.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                      </DialogClose>
                      <Button variant="destructive" onClick={() => handleRemoveAdmin(admin._id)}>
                        Confirm Remove
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </Button>
          <span>Page {currentPage} of {totalPages}</span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ManageSchoolAdmins;
