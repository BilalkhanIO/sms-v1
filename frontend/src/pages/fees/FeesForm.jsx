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
      description: fee?.data?.description || fee?.description || '',
      amount: fee?.data?.amount || fee?.amount || '',
      dueDate: (fee?.data?.dueDate || fee?.dueDate) ? new Date(fee?.data?.dueDate || fee?.dueDate).toISOString().split('T')[0] : '',
      student: fee?.data?.student?._id || fee?.data?.student || fee?.student?._id || fee?.student || '',
      type: fee?.data?.type || fee?.type || 'TUITION',
      status: fee?.data?.status || fee?.status || 'PENDING',
      academicYear: fee?.data?.academicYear || fee?.academicYear || '',
      term: fee?.data?.term || fee?.term || 'FIRST',
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

  const studentList = students?.data || students || [];
  const studentOptions = studentList.map(student => ({
    value: student._id,
    label: `${student.user?.firstName || ''} ${student.user?.lastName || ''} (${student.class?.name || student.rollNumber || 'No Class'})`.trim(),
  }));

  const typeOptions = [
    { value: 'TUITION', label: 'Tuition Fee' },
    { value: 'TRANSPORT', label: 'Transport Fee' },
    { value: 'LIBRARY', label: 'Library Fee' },
    { value: 'LABORATORY', label: 'Laboratory Fee' },
    { value: 'SPORTS', label: 'Sports Fee' },
    { value: 'OTHER', label: 'Other' },
  ];

  const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'PARTIAL', label: 'Partially Paid' },
    { value: 'PAID', label: 'Paid' },
    { value: 'OVERDUE', label: 'Overdue' }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title={isEditing ? 'Edit Fee' : 'Create Fee'}
        backUrl="/dashboard/fees"
      />

      <form onSubmit={formik.handleSubmit} className="max-w-3xl mx-auto">
        <FormSection>
          <SelectField
            label="Student"
            name="student"
            value={studentOptions.find(option => option.value === formik.values.student)}
            onChange={option => formik.setFieldValue('student', option?.value)}
            onBlur={() => formik.setFieldTouched('student')}
            error={formik.touched.student && formik.errors.student}
            options={studentOptions}
            required
          />

          <InputField
            label="Academic Year"
            name="academicYear"
            value={formik.values.academicYear}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.academicYear && formik.errors.academicYear}
            placeholder="e.g. 2024-2025"
            required
          />

          <SelectField
            label="Term"
            name="term"
            value={[
              { value: 'FIRST', label: 'First Term' },
              { value: 'SECOND', label: 'Second Term' },
              { value: 'THIRD', label: 'Third Term' },
              { value: 'ANNUAL', label: 'Annual' },
            ].find(o => o.value === formik.values.term)}
            onChange={option => formik.setFieldValue('term', option?.value)}
            onBlur={() => formik.setFieldTouched('term')}
            error={formik.touched.term && formik.errors.term}
            options={[
              { value: 'FIRST', label: 'First Term' },
              { value: 'SECOND', label: 'Second Term' },
              { value: 'THIRD', label: 'Third Term' },
              { value: 'ANNUAL', label: 'Annual' },
            ]}
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