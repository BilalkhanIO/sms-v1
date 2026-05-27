import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUpdateUserProfileMutation } from '../../api/usersApi';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const ChangePasswordForm = () => {
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      await updateUserProfile(values).unwrap();
      toast({
        title: 'Password changed successfully!',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Failed to change password',
        description: err.data?.message || 'Please try again.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full bg-yass-queen hover:bg-sister-sister">
          {isLoading ? 'Changing...' : 'Change Password'}
        </Button>
      </form>
    </Form>
  );
};

export default ChangePasswordForm;
