import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { subjectSchema } from '../../utils/validationSchemas';
import {
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useGetSubjectByIdQuery,
} from '../../api/subjectApi';
import { useGetTeachersQuery } from '../../api/teacherApi';
import Button from '../../components/common/Button';
import FormSection from '../../components/forms/FormSection';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';
import FormError from '../../components/forms/FormError';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';

const SubjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { data: subject, isLoading: isLoadingSubject } = useGetSubjectByIdQuery(id, {
    skip: !isEditing,
  });

  const [createSubject, { isLoading: isCreating }] = useCreateSubjectMutation();
  const [updateSubject, { isLoading: isUpdating }] = useUpdateSubjectMutation();
  const { data: teachers } = useGetTeachersQuery();

  const formik = useFormik({
    initialValues: {
      name: subject?.name || '',
      code: subject?.code || '',
      description: subject?.description || '',
      grade: subject?.grade || '',
      credits: subject?.credits || 0,
      teacherIds: subject?.teachers?.map(teacher => teacher.id) || [],
    },
    validationSchema: subjectSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isEditing) {
          await updateSubject({ id, ...values }).unwrap();
        } else {
          await createSubject(values).unwrap();
        }
        navigate('/dashboard/subjects');
      } catch (error) {
        console.error('Failed to save subject:', error);
      }
    },
  });

  if (isEditing && isLoadingSubject) {
    return <Spinner size="large" />;
  }

  const teacherOptions = teachers?.map(teacher => ({
    value: teacher.id,
    label: `${teacher.firstName} ${teacher.lastName}`,
  })) || [];

  const gradeOptions = [
    { value: '9', label: 'Grade 9' },
    { value: '10', label: 'Grade 10' },
    { value: '11', label: 'Grade 11' },
    { value: '12', label: 'Grade 12' },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title={isEditing ? 'Edit Subject' : 'Create Subject'}
        backUrl="/dashboard/subjects"
      />

      <form onSubmit={formik.handleSubmit} className="max-w-3xl mx-auto">
        <FormSection>
          <InputField
            label="Subject Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
            required
          />

          <InputField
            label="Subject Code"
            name="code"
            value={formik.values.code}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.code && formik.errors.code}
            required
          />

          <SelectField
            label="Grade"
            name="grade"
            value={gradeOptions.find(option => option.value === formik.values.grade)}
            onChange={option => formik.setFieldValue('grade', option?.value)}
            onBlur={() => formik.setFieldTouched('grade')}
            error={formik.touched.grade && formik.errors.grade}
            options={gradeOptions}
            required
          />

          <InputField
            label="Credits"
            name="credits"
            type="number"
            value={formik.values.credits}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.credits && formik.errors.credits}
            required
          />

          <SelectField
            label="Assigned Teachers"
            name="teacherIds"
            value={teacherOptions.filter(option => 
              formik.values.teacherIds.includes(option.value)
            )}
            onChange={options => 
              formik.setFieldValue(
                'teacherIds',
                options ? options.map(option => option.value) : []
              )
            }
            onBlur={() => formik.setFieldTouched('teacherIds')}
            error={formik.touched.teacherIds && formik.errors.teacherIds}
            options={teacherOptions}
            isMulti
          />

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
            onClick={() => navigate('/dashboard/subjects')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isCreating || isUpdating}
            disabled={!formik.isValid || !formik.dirty}
          >
            {isEditing ? 'Update Subject' : 'Create Subject'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SubjectForm; 