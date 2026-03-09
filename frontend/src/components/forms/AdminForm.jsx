import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useGetSchoolsQuery } from '../../api/schoolApi'; // Assuming this query exists
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const generateAdminSchema = (isEditing) =>
  z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: isEditing
      ? z.string().optional()
      : z.string().min(8, 'Password must be at least 8 characters'),
    schoolId: z.string().min(1, 'School is required'),
  });

const AdminForm = ({ onSubmit, initialData }) => {
  const isEditing = !!initialData;
  const adminSchema = generateAdminSchema(isEditing);

  const { data: schools, isLoading } = useGetSchoolsQuery();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminSchema),
    defaultValues: initialData || {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="name"
        control={control}
        render={({ field }) => <Input {...field} placeholder="Name" />}
      />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      <Controller
        name="email"
        control={control}
        render={({ field }) => <Input {...field} placeholder="Email" />}
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      <Controller
        name="password"
        control={control}
        render={({ field }) => <Input {...field} type="password" placeholder="Password" />}
      />
      {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      <Controller
        name="schoolId"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Select a school" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading" disabled>
                  Loading schools...
                </SelectItem>
              ) : (
                schools?.map((school) => (
                  <SelectItem key={school._id} value={school._id}>
                    {school.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        )}
      />
      {errors.schoolId && <p className="text-red-500">{errors.schoolId.message}</p>}
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default AdminForm;
