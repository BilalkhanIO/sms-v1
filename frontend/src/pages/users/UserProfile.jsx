import React from 'react';
import { useGetMyProfileQuery } from '../../api/usersApi';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import PageHeader from '../../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpdateProfileForm from '../../components/forms/UpdateProfileForm';
import ChangePasswordForm from '../../components/forms/ChangePasswordForm';

const UserProfile = () => {
  const { data: user, isLoading, isError, error } = useGetMyProfileQuery();

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (isError) {
    return (
      <ErrorMessage>
        Error: {error.data?.message || error.error || 'Failed to load profile data'}
      </ErrorMessage>
    );
  }

  const renderRoleSpecificDetails = () => {
    switch (user?.role) {
      case 'TEACHER':
        return (
          <TabsContent value="teacher">
            <h3 className="text-lg font-semibold">Teacher Details</h3>
            <p>Qualifications: {user?.teacherDetails?.qualification}</p>
            <p>Specialization: {user?.teacherDetails?.specialization}</p>
          </TabsContent>
        );
      case 'STUDENT':
        return (
          <TabsContent value="student">
            <h3 className="text-lg font-semibold">Student Details</h3>
            <p>Admission Number: {user?.studentDetails?.admissionNumber}</p>
            <p>Roll Number: {user?.studentDetails?.rollNumber}</p>
          </TabsContent>
        );
      case 'PARENT':
        return (
          <TabsContent value="parent">
            <h3 className="text-lg font-semibold">Parent Details</h3>
            <ul>
              {user?.parentDetails?.wards.map((ward) => (
                <li key={ward._id}>{`${ward.firstName} ${ward.lastName}`}</li>
              ))}
            </ul>
          </TabsContent>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="My Profile" />
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.profilePicture} alt={`${user?.firstName} ${user?.lastName}`} />
              <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{`${user?.firstName} ${user?.lastName}`}</CardTitle>
              <p className="text-muted-foreground">{user?.email}</p>
              <p className="text-sm text-gray-500">{user?.role}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Edit Profile</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <UpdateProfileForm user={user} />
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Change Password</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <ChangePasswordForm />
              </DialogContent>
            </Dialog>
          </div>
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {user?.role === 'TEACHER' && <TabsTrigger value="teacher">Teacher Details</TabsTrigger>}
              {user?.role === 'STUDENT' && <TabsTrigger value="student">Student Details</TabsTrigger>}
              {user?.role === 'PARENT' && <TabsTrigger value="parent">Parent Details</TabsTrigger>}
            </TabsList>
            <TabsContent value="overview">
              <p>Here is an overview of your profile.</p>
            </TabsContent>
            {renderRoleSpecificDetails()}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
