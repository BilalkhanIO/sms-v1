import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import PageHeader from '../../components/common/PageHeader';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { useCreateSchoolMutation } from '../../api/schoolsApi';

const formSchema = z.object({
  name: z.string().min(1, 'School name is required'),
  address: z.string().min(1, 'Address is required'),
  contactInfo: z.object({
    phone: z.string().min(1, 'Contact phone is required'),
    email: z.string().email('Invalid email address'),
  }),
  adminFirstName: z.string().min(1, 'Admin first name is required'),
  adminLastName: z.string().min(1, 'Admin last name is required'),
  adminEmail: z.string().email('Invalid admin email address'),
});

const CreateSchool = () => {
  const navigate = useNavigate();
  const [createSchool, { isLoading }] = useCreateSchoolMutation();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      contactInfo: {
        phone: '',
        email: '',
      },
      adminFirstName: '',
      adminLastName: '',
      adminEmail: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      await createSchool(values).unwrap();
      navigate('/dashboard/schools');
    } catch (err) {
      console.error('Failed to create school:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="Create New School" backUrl="/dashboard/schools" />
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
              <h3 className="text-xl font-semibold mb-4 border-b pb-2 mt-8">Admin User Details</h3>
              <FormField
                control={form.control}
                name="adminFirstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter admin first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="adminLastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter admin last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="adminEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter admin email" {...field} />
                    </FormControl>
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
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create School'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateSchool;
