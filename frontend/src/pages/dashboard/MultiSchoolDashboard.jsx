import React, { useState } from "react";
import {
  useGetMultiSchoolAdminsQuery,
  useAssignSchoolAdminMutation,
  useRemoveSchoolAdminMutation,
} from "@/api/multiSchoolAdminApi";
import { useGetSchoolsQuery } from "@/api/schoolApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/store/zustand/useUIStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const MultiSchoolDashboard = () => {
  const addToast = useUIStore((s) => s.addToast);
  const { data: schoolsRaw, isLoading: isLoadingSchools, isError: isErrorSchools } = useGetSchoolsQuery();
  const { data: adminsRaw, isLoading: isLoadingAdmins, isError: isErrorAdmins } = useGetMultiSchoolAdminsQuery();
  const [assignAdmin] = useAssignSchoolAdminMutation();
  const [removeAdmin] = useRemoveSchoolAdminMutation();

  const schools = schoolsRaw?.data || schoolsRaw || [];
  const admins = adminsRaw?.data || adminsRaw || [];

  const [adminEmail, setAdminEmail] = useState("");
  const [assigningSchoolId, setAssigningSchoolId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAssignAdmin = async (schoolId) => {
    if (!adminEmail.trim()) {
      addToast({ type: "error", title: "Enter an email address" });
      return;
    }
    try {
      await assignAdmin({ schoolId, email: adminEmail.trim() }).unwrap();
      addToast({ type: "success", title: "Admin assigned successfully" });
      setAdminEmail("");
      setDialogOpen(false);
    } catch (error) {
      addToast({ type: "error", title: "Failed to assign admin", message: error.data?.message });
    }
  };

  const handleRemoveAdmin = async (schoolId, adminId) => {
    try {
      await removeAdmin({ schoolId, adminId }).unwrap();
      addToast({ type: "success", title: "Admin removed successfully" });
    } catch (error) {
      addToast({ type: "error", title: "Failed to remove admin", message: error.data?.message });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Multi-School Admin Dashboard</h1>
      <Tabs defaultValue="schools">
        <TabsList>
          <TabsTrigger value="schools">Manage Schools</TabsTrigger>
          <TabsTrigger value="admins">Multi-School Admins</TabsTrigger>
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
                <p className="text-red-500">Error loading schools.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schools.map((school) => (
                      <TableRow key={school._id}>
                        <TableCell className="font-medium">{school.name}</TableCell>
                        <TableCell>{school.status}</TableCell>
                        <TableCell>
                          {school.admin
                            ? `${school.admin.firstName || ''} ${school.admin.lastName || ''}`.trim() || school.admin.email
                            : "Not Assigned"}
                        </TableCell>
                        <TableCell>
                          {school.admin ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveAdmin(school._id, school.admin._id)}
                            >
                              Remove Admin
                            </Button>
                          ) : (
                            <Dialog open={dialogOpen && assigningSchoolId === school._id} onOpenChange={(open) => { setDialogOpen(open); if (!open) setAdminEmail(""); }}>
                              <DialogTrigger asChild>
                                <Button size="sm" onClick={() => setAssigningSchoolId(school._id)}>
                                  Assign Admin
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Assign Admin to {school.name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="admin-email">Admin Email</Label>
                                    <Input
                                      id="admin-email"
                                      type="email"
                                      placeholder="Enter admin email"
                                      value={adminEmail}
                                      onChange={(e) => setAdminEmail(e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                  <Button onClick={() => handleAssignAdmin(school._id)}>
                                    Assign
                                  </Button>
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
              <CardTitle>Multi-School Admins</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAdmins ? (
                <p>Loading admins...</p>
              ) : isErrorAdmins ? (
                <p className="text-red-500">Error loading admins.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Managed Schools</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.map((admin) => (
                      <TableRow key={admin._id}>
                        <TableCell>{admin.firstName} {admin.lastName}</TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>{admin.managedSchools?.length ?? 0}</TableCell>
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
