import React, { useState } from 'react';
import {
  useGetAllSchoolAdminsQuery,
  useCreateSchoolAdminMutation,
  useUpdateSchoolAdminMutation,
  useDeleteSchoolAdminMutation,
} from '../../api/multiSchoolAdminApi';
import { debounce } from 'lodash';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Input } from '../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import AdminForm from '../../components/forms/AdminForm'; // Assuming this form component exists

const CentralizedAdminManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const { data, isLoading, isError, error } = useGetAllSchoolAdminsQuery();
  const [createAdmin] = useCreateSchoolAdminMutation();
  const [updateAdmin] = useUpdateSchoolAdminMutation();
  const [deleteAdmin] = useDeleteSchoolAdminMutation();

  const handleSearch = debounce((event) => {
    setSearchTerm(event.target.value);
  }, 300);

  const handleFormSubmit = async (values) => {
    if (selectedAdmin) {
      await updateAdmin({ adminId: selectedAdmin._id, ...values });
    } else {
      await createAdmin(values);
    }
    setIsDialogOpen(false);
    setSelectedAdmin(null);
  };

  const openDialog = (admin = null) => {
    setSelectedAdmin(admin);
    setIsDialogOpen(true);
  };

  if (isLoading) return <Spinner size="large" />;
  if (isError) return <ErrorMessage message={error.message} />;

  const filteredAdmins =
    data?.admins?.filter(
      (admin) =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.school.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div>
      <PageHeader title="Centralized Admin Management" />
      <div className="flex justify-between items-center mb-4">
        <Input placeholder="Search admins..." onChange={handleSearch} className="max-w-sm" />
        <Button onClick={() => openDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Admin
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>School</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAdmins.map((admin) => (
            <TableRow key={admin._id}>
              <TableCell>{admin.name}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>{admin.school.name}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => openDialog(admin)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteAdmin(admin._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAdmin ? 'Edit Admin' : 'Add New Admin'}</DialogTitle>
          </DialogHeader>
          <AdminForm onSubmit={handleFormSubmit} initialData={selectedAdmin} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CentralizedAdminManagement;