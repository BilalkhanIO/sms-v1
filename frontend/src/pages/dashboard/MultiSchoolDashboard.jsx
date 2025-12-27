import React, { useState } from "react";
import {
  useGetManagedSchoolsQuery,
  useGetSchoolAdminsQuery,
  useAssignSchoolAdminMutation,
  useUnassignSchoolAdminMutation
} from "@/api/multiSchoolAdminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const MultiSchoolDashboard = () => {
  const { toast } = useToast();
  const { data: schools, isLoading: isLoadingSchools, isError: isErrorSchools } = useGetManagedSchoolsQuery();
  const { data: admins, isLoading: isLoadingAdmins, isError: isErrorAdmins } = useGetSchoolAdminsQuery();
  const [assignAdmin] = useAssignSchoolAdminMutation();
  const [unassignAdmin] = useUnassignSchoolAdminMutation();

  const [selectedAdmin, setSelectedAdmin] = useState("");

  const handleAssignAdmin = async (schoolId) => {
    if (!selectedAdmin || !schoolId) {
      toast({
        title: "Error",
        description: "Please select a school and an admin.",
        variant: "destructive",
      });
      return;
    }

    try {
      await assignAdmin({ schoolId, adminId: selectedAdmin }).unwrap();
      toast({
        title: "Success",
        description: "Admin assigned successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.data?.message || "An error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleUnassignAdmin = async (schoolId) => {
    try {
      await unassignAdmin({ schoolId }).unwrap();
      toast({
        title: "Success",
        description: "Admin unassigned successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.data?.message || "An error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Multi-School Admin Dashboard</h1>
      <Tabs defaultValue="schools">
        <TabsList>
          <TabsTrigger value="schools">Manage Schools</TabsTrigger>
          <TabsTrigger value="admins">Manage Admins</TabsTrigger>
        </TabsList>
        <TabsContent value="schools">
          <Card>
            <CardHeader>
              <CardTitle>Your Schools</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingSchools ? (
                <p>Loading schools...</p>
              ) : isErrorSchools ? (
                <p>Error loading schools.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schools.data.map((school) => (
                      <TableRow key={school._id}>
                        <TableCell>{school.name}</TableCell>
                        <TableCell>
                          {school.admin ? `${school.admin.firstName} ${school.admin.lastName}` : "Not Assigned"}
                        </TableCell>
                        <TableCell>
                          {school.admin ? (
                            <Button onClick={() => handleUnassignAdmin(school._id)}>Unassign</Button>
                          ) : (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button>Assign Admin</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Assign Admin to {school.name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <Label htmlFor="admin-select">Select Admin</Label>
                                  <Select onValueChange={setSelectedAdmin}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select an admin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {admins?.data.map((admin) => (
                                        <SelectItem key={admin._id} value={admin._id}>
                                          {admin.firstName} {admin.lastName}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Button onClick={() => handleAssignAdmin(school._id)}>Assign</Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="admins">
          <Card>
            <CardHeader>
              <CardTitle>School Admins</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAdmins ? (
                <p>Loading admins...</p>
              ) : isErrorAdmins ? (
                <p>Error loading admins.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>School</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.data.map((admin) => (
                      <TableRow key={admin._id}>
                        <TableCell>{admin.firstName} {admin.lastName}</TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>{admin.school?.name || "Not Assigned"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MultiSchoolDashboard;
