import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useCreateTeacherMutation, useUpdateTeacherMutation } from '../api/teacherApi';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  employeeId: Yup.string().required('Required'),
  qualification: Yup.string().required('Required'),
  specialization: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  address: Yup.string(),
  dateOfBirth: Yup.date(),
  salary: Yup.number(),
  password: Yup.string().when('$isEdit', {
    is: false,
    then: (s) => s.required('Password required for new teacher'),
  }),
});

const TeacherForm = ({ teacher, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const [createTeacher] = useCreateTeacherMutation();
  const [updateTeacher] = useUpdateTeacherMutation();

  const isEdit = !!teacher;

  const initialValues = {
    firstName: teacher?.user?.firstName || '',
    lastName: teacher?.user?.lastName || '',
    employeeId: teacher?.employeeId || '',
    qualification: teacher?.qualification || '',
    specialization: teacher?.specialization || '',
    email: teacher?.user?.email || '',
    address: teacher?.address || '',
    phone: teacher?.contactInfo?.phone || '',
    dateOfBirth: teacher?.dateOfBirth ? new Date(teacher.dateOfBirth).toISOString().split('T')[0] : '',
    salary: teacher?.salary || '',
    password: '',
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        employeeId: values.employeeId,
        qualification: values.qualification,
        specialization: values.specialization,
        email: values.email,
        address: values.address,
        contactInfo: { phone: values.phone },
        dateOfBirth: values.dateOfBirth,
        salary: values.salary,
        ...(values.password && { password: values.password }),
      };

      if (isEdit) {
        await updateTeacher({ id: teacher._id, ...payload }).unwrap();
      } else {
        await createTeacher(payload).unwrap();
      }
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard/teachers');
      }
    } catch (err) {
      setFieldError('email', err.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = 'mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700';

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validationContext={{ isEdit }}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className={labelClass}>First Name</label>
              <Field type="text" name="firstName" id="firstName" className={fieldClass} />
              <ErrorMessage name="firstName" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>Last Name</label>
              <Field type="text" name="lastName" id="lastName" className={fieldClass} />
              <ErrorMessage name="lastName" component="div" className="text-red-500 text-xs mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="employeeId" className={labelClass}>Employee ID</label>
              <Field type="text" name="employeeId" id="employeeId" className={fieldClass} />
              <ErrorMessage name="employeeId" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>Email</label>
              <Field type="email" name="email" id="email" className={fieldClass} />
              <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="qualification" className={labelClass}>Qualification</label>
              <Field type="text" name="qualification" id="qualification" className={fieldClass} />
              <ErrorMessage name="qualification" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <label htmlFor="specialization" className={labelClass}>Specialization</label>
              <Field type="text" name="specialization" id="specialization" className={fieldClass} />
              <ErrorMessage name="specialization" component="div" className="text-red-500 text-xs mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className={labelClass}>Phone</label>
              <Field type="text" name="phone" id="phone" className={fieldClass} />
            </div>
            <div>
              <label htmlFor="dateOfBirth" className={labelClass}>Date of Birth</label>
              <Field type="date" name="dateOfBirth" id="dateOfBirth" className={fieldClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="salary" className={labelClass}>Salary</label>
              <Field type="number" name="salary" id="salary" className={fieldClass} />
            </div>
            <div>
              <label htmlFor="address" className={labelClass}>Address</label>
              <Field type="text" name="address" id="address" className={fieldClass} />
            </div>
          </div>

          {!isEdit && (
            <div>
              <label htmlFor="password" className={labelClass}>Password</label>
              <Field type="password" name="password" id="password" className={fieldClass} />
              <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
            </div>
          )}

          <div className="flex justify-end gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Teacher' : 'Create Teacher'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TeacherForm;
