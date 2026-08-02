import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCreateExamMutation, useUpdateExamMutation, useGetExamByIdQuery } from '../../api/examApi';
import { useGetClassesQuery } from '../../api/classesApi';
import { useGetSubjectsQuery } from '../../api/subjectApi';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';

const examSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  type: Yup.string().required('Type is required'),
  class: Yup.string().required('Class is required'),
  subject: Yup.string().required('Subject is required'),
  date: Yup.date().required('Date is required'),
  duration: Yup.number().min(1).required('Duration is required'),
  totalMarks: Yup.number().min(1).required('Total marks is required'),
  passingMarks: Yup.number().min(0).required('Passing marks is required'),
});

const EXAM_TYPES = ['MIDTERM', 'FINAL', 'QUIZ', 'ASSIGNMENT', 'PRACTICAL'];

const ExamForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { data: exam, isLoading: isLoadingExam } = useGetExamByIdQuery(id, { skip: !isEditing });
  const { data: classesRaw } = useGetClassesQuery();
  const { data: subjectsRaw } = useGetSubjectsQuery();
  const classes = classesRaw?.data || classesRaw || [];
  const subjects = subjectsRaw?.data || subjectsRaw || [];
  const [createExam, { isLoading: isCreating }] = useCreateExamMutation();
  const [updateExam, { isLoading: isUpdating }] = useUpdateExamMutation();

  const formik = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
    initialValues: {
      title: exam?.title || '',
      type: exam?.type || '',
      class: exam?.class?._id || exam?.class || '',
      subject: exam?.subject?._id || exam?.subject || '',
      date: exam?.date ? new Date(exam.date).toISOString().split('T')[0] : '',
      duration: exam?.duration || '',
      totalMarks: exam?.totalMarks || '',
      passingMarks: exam?.passingMarks || '',
      description: exam?.description || '',
    },
    validationSchema: examSchema,
    onSubmit: async (values) => {
      try {
        if (isEditing) {
          await updateExam({ id, ...values }).unwrap();
        } else {
          await createExam(values).unwrap();
        }
        navigate('/dashboard/exams');
      } catch (err) {
        console.error('Save failed:', err);
      }
    },
  });

  if (isEditing && isLoadingExam) return <Spinner />;

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
  const errorClass = 'mt-1 text-sm text-red-600';

  return (
    <div>
      <PageHeader title={isEditing ? 'Edit Exam' : 'Create Exam'} backUrl="/dashboard/exams" />

      <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Title *</label>
            <input className={inputClass} name="title" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.title && formik.errors.title && <p className={errorClass}>{formik.errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Type *</label>
              <select className={inputClass} name="type" value={formik.values.type} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                <option value="">Select type</option>
                {EXAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {formik.touched.type && formik.errors.type && <p className={errorClass}>{formik.errors.type}</p>}
            </div>
            <div>
              <label className={labelClass}>Date *</label>
              <input type="date" className={inputClass} name="date" value={formik.values.date} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {formik.touched.date && formik.errors.date && <p className={errorClass}>{formik.errors.date}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Class *</label>
              <select className={inputClass} name="class" value={formik.values.class} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                <option value="">Select class</option>
                {classes?.map((c) => <option key={c._id} value={c._id}>{c.name} {c.section}</option>)}
              </select>
              {formik.touched.class && formik.errors.class && <p className={errorClass}>{formik.errors.class}</p>}
            </div>
            <div>
              <label className={labelClass}>Subject *</label>
              <select className={inputClass} name="subject" value={formik.values.subject} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                <option value="">Select subject</option>
                {subjects?.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              {formik.touched.subject && formik.errors.subject && <p className={errorClass}>{formik.errors.subject}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Duration (min) *</label>
              <input type="number" className={inputClass} name="duration" value={formik.values.duration} onChange={formik.handleChange} onBlur={formik.handleBlur} min="1" placeholder="e.g. 90" />
              {formik.touched.duration && formik.errors.duration && <p className={errorClass}>{formik.errors.duration}</p>}
            </div>
            <div>
              <label className={labelClass}>Total Marks *</label>
              <input type="number" className={inputClass} name="totalMarks" value={formik.values.totalMarks} onChange={formik.handleChange} onBlur={formik.handleBlur} min="1" />
              {formik.touched.totalMarks && formik.errors.totalMarks && <p className={errorClass}>{formik.errors.totalMarks}</p>}
            </div>
            <div>
              <label className={labelClass}>Passing Marks *</label>
              <input type="number" className={inputClass} name="passingMarks" value={formik.values.passingMarks} onChange={formik.handleChange} onBlur={formik.handleBlur} min="0" />
              {formik.touched.passingMarks && formik.errors.passingMarks && <p className={errorClass}>{formik.errors.passingMarks}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea className={inputClass} name="description" rows={3} value={formik.values.description} onChange={formik.handleChange} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigate('/dashboard/exams')} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={isCreating || isUpdating || !formik.isValid} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {isCreating || isUpdating ? 'Saving...' : isEditing ? 'Update Exam' : 'Create Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamForm;
