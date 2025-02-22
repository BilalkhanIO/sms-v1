import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { feeSchema } from '../../utils/validationSchemas';
import {
  useCreateFeeMutation,
  useUpdateFeeMutation,
  useGetFeeByIdQuery,
} from '../../api/feesApi';
import { useGetStudentsQuery } from '../../api/studentApi';
import Button from '../../components/common/Button';
import FormSection from '../../components/forms/FormSection';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';
import FormError from '../../components/forms/FormError';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';

const FeesForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { data: fee, isLoading: isLoadingFee } = useGetFeeByIdQuery(id, {
    skip: !isEditing,
  });

  const [createFee, { isLoading: isCreating }] = useCreateFeeMutation();
  const [updateFee, { isLoading: isUpdating }] = useUpdateFeeMutation();
  const { data: students } = useGetStudentsQuery();

  const formik = useFormik({
    initialValues: {
      title: fee?.title || '',
      description: fee?.description || '',
      amount: fee?.amount || '',
      dueDate: fee?.dueDate ? new Date(fee.dueDate).toISOString().split('T')[0] : '',
      studentId: fee?.student?.id || '',
      type: fee?.type || 'tuition',
      status: fee?.status || 'pending'
    },
    validationSchema: feeSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isEditing) {
          await updateFee({ id, ...values }).unwrap();
        } else {
          await createFee(values).unwrap();
        }
        navigate('/dashboard/fees');
      } catch (error) {
        console.error('Failed to save fee:', error);
      }
    },
  });

  if (isEditing && isLoadingFee) {
    return <Spinner size="large" />;
  }

  const studentOptions = students?.map(student => ({
    value: student.id,
    label: `${student.firstName} ${student.lastName} (${student.class?.name || 'No Class'})`,
  })) || [];

  const typeOptions = [
    { value: 'tuition', label: 'Tuition Fee' },
    { value: 'exam', label: 'Exam Fee' },
    { value: 'transport', label: 'Transport Fee' },
    { value: 'library', label: 'Library Fee' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'partial', label: 'Partially Paid' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title={isEditing ? 'Edit Fee' : 'Create Fee'}
        backUrl="/dashboard/fees"
      />

      <form onSubmit={formik.handleSubmit} className="max-w-3xl mx-auto">
        <FormSection>
          <InputField
            label="Fee Title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && formik.errors.title}
            required
          />

          <SelectField
            label="Student"
            name="studentId"
            value={studentOptions.find(option => option.value === formik.values.studentId)}
            onChange={option => formik.setFieldValue('studentId', option?.value)}
            onBlur={() => formik.setFieldTouched('studentId')}
            error={formik.touched.studentId && formik.errors.studentId}
            options={studentOptions}
            required
          />

          <SelectField
            label="Fee Type"
            name="type"
            value={typeOptions.find(option => option.value === formik.values.type)}
            onChange={option => formik.setFieldValue('type', option?.value)}
            onBlur={() => formik.setFieldTouched('type')}
            error={formik.touched.type && formik.errors.type}
            options={typeOptions}
            required
          />

          <InputField
            label="Amount"
            name="amount"
            type="number"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.amount && formik.errors.amount}
            required
          />

          <InputField
            label="Due Date"
            name="dueDate"
            type="date"
            value={formik.values.dueDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.dueDate && formik.errors.dueDate}
            required
          />

          {isEditing && (
            <SelectField
              label="Status"
              name="status"
              value={statusOptions.find(option => option.value === formik.values.status)}
              onChange={option => formik.setFieldValue('status', option?.value)}
              onBlur={() => formik.setFieldTouched('status')}
              error={formik.touched.status && formik.errors.status}
              options={statusOptions}
              required
            />
          )}

          <InputField
            label="Description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && formik.errors.description}
            multiline
            rows={4}
          />
        </FormSection>

        <div className="mt-6 flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/dashboard/fees')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isCreating || isUpdating}
            disabled={!formik.isValid || !formik.dirty}
          >
            {isEditing ? 'Update Fee' : 'Create Fee'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FeesForm; 