import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import PageHeader from '../../components/common/PageHeader';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useGetSchoolByIdQuery, useUpdateSchoolMutation } from '../../api/schoolsApi';

const formSchema = z.object({
  name: z.string().min(1, 'School name is required'),
  address: z.string().min(1, 'Address is required'),
  contactInfo: z.object({
    phone: z.string().min(1, 'Contact phone is required'),
    email: z.string().email('Invalid email address'),
  }),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING_APPROVAL']),
});

const UpdateSchool = () => {
  const navigate = useNavigate();
  const { id: schoolId } = useParams();
  const { data: school, isLoading: isSchoolLoading, isError: isSchoolError, error: schoolError } = useGetSchoolByIdQuery(schoolId);
  const [updateSchool, { isLoading: isUpdating }] = useUpdateSchoolMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      contactInfo: {
        phone: '',
        email: '',
      },
      status: 'PENDING_APPROVAL',
    },
  });

  useEffect(() => {
    if (school?.data?.school) {
      form.reset({
        name: school.data.school.name || '',
        address: school.data.school.address || '',
        contactInfo: {
          phone: school.data.school.contactInfo?.phone || '',
          email: school.data.school.contactInfo?.email || '',
        },
        status: school.data.school.status || 'PENDING_APPROVAL',
      });
    }
  }, [school, form]);

  const onSubmit = async (values) => {
    try {
      await updateSchool({ id: schoolId, ...values }).unwrap();
      navigate('/dashboard/schools');
    } catch (err) {
      console.error('Failed to update school:', err);
      // You might want to display a toast notification or a general error message here
    }
  };

  if (isSchoolLoading) {
    return <Spinner size="large" />;
  }

  if (isSchoolError) {
    return (
      <ErrorMessage>
        Error: {schoolError.data?.message || schoolError.error || 'Failed to load school for editing'}
      </ErrorMessage>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title={`Edit School: ${school?.data?.name}`} backUrl="/dashboard/schools" />
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>School Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter school name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactInfo.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactInfo.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/dashboard/schools')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? 'Updating...' : 'Update School'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateSchool;