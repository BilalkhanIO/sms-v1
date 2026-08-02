import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCreateSubjectMutation } from '../../api/subjectApi';
import { useGetClassesQuery } from '../../api/classesApi';
import { useGetTeachersQuery } from '../../api/teacherApi';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';

const subjectSchema = Yup.object().shape({
  name: Yup.string().required('Subject name is required'),
  code: Yup.string().required('Subject code is required'),
  credits: Yup.number().required('Credits is required').min(0),
  type: Yup.string().oneOf(['MANDATORY', 'ELECTIVE']).required('Type is required'),
});

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const errorClass = 'mt-1 text-sm text-red-600';

const CreateSubject = () => {
  const navigate = useNavigate();
  const [createSubject, { isLoading }] = useCreateSubjectMutation();
  const { data: classesRaw } = useGetClassesQuery();
  const { data: teachersRaw } = useGetTeachersQuery();
  const classes = classesRaw?.data || classesRaw || [];
  const teachers = teachersRaw?.data || teachersRaw || [];

  const formik = useFormik({
    initialValues: {
      name: '',
      code: '',
      description: '',
      credits: '',
      type: 'MANDATORY',
      assignedClasses: [],
      assignedTeachers: [],
    },
    validationSchema: subjectSchema,
    onSubmit: async (values) => {
      try {
        await createSubject({
          ...values,
          credits: Number(values.credits),
        }).unwrap();
        navigate('/dashboard/subjects');
      } catch (err) {
        console.error('Failed to create subject:', err);
      }
    },
  });

  return (
    <div>
      <PageHeader title="Create Subject" backUrl="/dashboard/subjects" />

      <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Subject Name *</label>
              <input
                className={inputClass}
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. Mathematics"
              />
              {formik.touched.name && formik.errors.name && <p className={errorClass}>{formik.errors.name}</p>}
            </div>
            <div>
              <label className={labelClass}>Subject Code *</label>
              <input
                className={inputClass}
                name="code"
                value={formik.values.code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. MATH101"
              />
              {formik.touched.code && formik.errors.code && <p className={errorClass}>{formik.errors.code}</p>}
            </div>
            <div>
              <label className={labelClass}>Credits *</label>
              <input
                type="number"
                min="0"
                className={inputClass}
                name="credits"
                value={formik.values.credits}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.credits && formik.errors.credits && <p className={errorClass}>{formik.errors.credits}</p>}
            </div>
            <div>
              <label className={labelClass}>Type *</label>
              <select
                className={inputClass}
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
              >
                <option value="MANDATORY">Mandatory</option>
                <option value="ELECTIVE">Elective</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              className={inputClass}
              name="description"
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              placeholder="Optional description"
            />
          </div>

          <div>
            <label className={labelClass}>Assigned Classes</label>
            <select
              multiple
              className={`${inputClass} h-32`}
              name="assignedClasses"
              value={formik.values.assignedClasses}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, o => o.value);
                formik.setFieldValue('assignedClasses', selected);
              }}
            >
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.name} {c.section}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>

          <div>
            <label className={labelClass}>Assigned Teachers</label>
            <select
              multiple
              className={`${inputClass} h-32`}
              name="assignedTeachers"
              value={formik.values.assignedTeachers}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, o => o.value);
                formik.setFieldValue('assignedTeachers', selected);
              }}
            >
              {teachers.map(t => (
                <option key={t._id} value={t._id}>
                  {t.user?.firstName || ''} {t.user?.lastName || ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/dashboard/subjects')}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formik.isValid}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubject;
