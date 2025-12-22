import React, { useState } from "react";
import { useGetSchoolsQuery } from "../../api/schoolApi";
import { useGetUsersQuery, useUpdateUserRoleMutation } from "../../api/usersApi";
import Spinner from "../common/Spinner";
import ErrorMessage from "../common/ErrorMessage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";
import UserList from "../../pages/users/UserList";

const SchoolCard = ({ school, onManageAdminsClick }) => (
  <Card>
    <CardHeader>
      <CardTitle>{school.name}</CardTitle>
      <CardDescription>{school.address}</CardDescription>
    </CardHeader>
    <CardContent>
      <p>
        <strong>Status:</strong> {school.status}
      </p>
      <p>
        <strong>Admin:</strong>{" "}
        {school.admin ? school.admin.firstName : "Not Assigned"}
      </p>
      <Button onClick={() => onManageAdminsClick(school)} className="mt-4">
        Manage Admins
      </Button>
    </CardContent>
  </Card>
);

const ManageAdminsModal = ({ school, users, onAssign, isLoading }) => {
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const { toast } = useToast();

  const handleAssign = () => {
    if (!selectedAdmin) {
      toast({
        title: "Error",
        description: "Please select an admin to assign.",
        variant: "destructive",
      });
      return;
    }
    onAssign(school._id, selectedAdmin, "SCHOOL_ADMIN");
  };

  const potentialAdmins = users.filter(
    (user) => user.school === school._id && user.role !== "SCHOOL_ADMIN"
  );

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Manage Admins for {school.name}</DialogTitle>
      </DialogHeader>
      <div>
        <h3 className="text-lg font-semibold">Current Admin</h3>
        <p>
          {school.admin
            ? `${school.admin.firstName} ${school.admin.lastName}`
            : "None"}
        </p>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Assign New Admin</h3>
        <Select onValueChange={setSelectedAdmin}>
          <SelectTrigger>
            <SelectValue placeholder="Select a user to be School Admin" />
          </SelectTrigger>
          <SelectContent>
            {potentialAdmins.map((user) => (
              <SelectItem key={user._id} value={user._id}>
                {user.firstName} {user.lastName} ({user.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleAssign} disabled={isLoading} className="mt-2">
          {isLoading ? "Assigning..." : "Assign as School Admin"}
        </Button>
      </div>
    </DialogContent>
  );
};

const MultiSchoolAdminDashboard = () => {
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const {
    data: schools,
    isLoading: schoolsLoading,
    isError: schoolsError,
    error: schoolsErr,
  } = useGetSchoolsQuery();
  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
    error: usersErr,
  } = useGetUsersQuery();
  const [
    updateUserRole,
    { isLoading: isUpdatingRole, isError: updateRoleError, error: updateRoleErr },
  ] = useUpdateUserRoleMutation();

  const handleManageAdminsClick = (school) => {
    setSelectedSchool(school);
    setIsModalOpen(true);
  };

  const handleAssignAdmin = async (schoolId, userId, role) => {
    try {
      await updateUserRole({ id: userId, role }).unwrap();
      toast({
        title: "Success",
        description: "School Admin has been assigned successfully.",
      });
      setIsModalOpen(false);
    } catch (err) {
      toast({
        title: "Error",
        description:
          err.data?.message || "Failed to assign School Admin.",
        variant: "destructive",
      });
    }
  };

  if (schoolsLoading || usersLoading) {
    return <Spinner size="large" />;
  }

  if (schoolsError || usersError) {
    return (
      <ErrorMessage>
        Error:{" "}
        {schoolsErr?.data?.message ||
          usersErr?.data?.message ||
          "Failed to load dashboard data"}
      </ErrorMessage>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Multi-School Admin Dashboard</h1>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Schools Overview</TabsTrigger>
          <TabsTrigger value="userManagement">User Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
              <SchoolCard
                key={school._id}
                school={school}
                onManageAdminsClick={handleManageAdminsClick}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="userManagement">
          <Card>
            <CardHeader>
              <CardTitle>Manage Users Across Schools</CardTitle>
            </CardHeader>
            <CardContent>
              <UserList users={users} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedSchool && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <ManageAdminsModal
            school={selectedSchool}
            users={users}
            onAssign={handleAssignAdmin}
            isLoading={isUpdatingRole}
          />
        </Dialog>
      )}
    </div>
  );
};

export default MultiSchoolAdminDashboard;
