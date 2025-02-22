// src/components/TeacherForm.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createTeacher, updateTeacher } from '../store/teacherSlice';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    employeeId: Yup.string().required('Required'),
    qualification: Yup.string().required('Required'),
    specialization: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    address: Yup.string(),
    'contactInfo.phone': Yup.string(), // Validate nested field
    dateOfBirth: Yup.date(),
    salary: Yup.number(),
    // Add validation for other fields
});

const TeacherForm = ({ teacher }) => {  // Receive teacher as prop
    const dispatch = useDispatch();
    const navigate = useNavigate();
     // Initial values for the form
    const initialValues = {
        firstName: teacher?.user.firstName || '', // Populate from teacher prop if available
        lastName: teacher?.user.lastName || '',
        employeeId: teacher?.employeeId || '',
        qualification: teacher?.qualification || '',
        specialization: teacher?.specialization || '',
        email: teacher?.user.email || '',
        address: teacher?.address || '',
        contactInfo: teacher?.contactInfo || { phone: '', alternatePhone: '', emergencyContact: { name: '', relation: '', phone: '' } },
        dateOfBirth: teacher?.dateOfBirth ? new Date(teacher.dateOfBirth).toISOString().split('T')[0] : '', // Format date
        salary: teacher?.salary || '',
        password: '', // Add password field, but don't pre-fill it
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const teacherData = {
                firstName: values.firstName,
                lastName: values.lastName,
                employeeId: values.employeeId,
                qualification: values.qualification,
                specialization: values.specialization,
                email: values.email,
                address: values.address,
                contactInfo: values.contactInfo,  // Send entire contactInfo object
                dateOfBirth: values.dateOfBirth,
                salary: values.salary,
                password: values.password, // Include password
            };

            if (teacher) {
                // Update existing teacher
                await dispatch(updateTeacher({ id: teacher._id, data: teacherData })).unwrap();
            } else {
                // Create new teacher
              await dispatch(createTeacher(teacherData)).unwrap();
            }
            navigate('/dashboard/teachers');
        } catch (error) {
            console.error("Error in form submission:", error);
            // Handle errors (e.g., show an error message)
        } finally {
            setSubmitting(false);
        }
    };

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize // Important for populating form with existing data
      >
        {({ isSubmitting, values, setFieldValue, errors, touched }) => (  // Destructure values, and errors
          <Form className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <Field type="text" name="firstName" id="firstName" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              <ErrorMessage name="firstName" component="div" className="text-red-500 text-xs" />
            </div>

            <div>
              <label htmlFor="lastName">Last Name</label>
              <Field type="text" name="lastName" id="lastName" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                <ErrorMessage name="lastName" component="div" className="text-red-500 text-xs" />
            </div>
            <div>
              <label htmlFor="employeeId">Employee ID</label>
              <Field type="text" name="employeeId" id="employeeId" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                <ErrorMessage name="employeeId" component="div" className="text-red-500 text-xs" />
            </div>

            <div>
              <label htmlFor="qualification">Qualification</label>
              <Field type="text" name="qualification" id="qualification" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                <ErrorMessage name="qualification" component="div" className="text-red-500 text-xs" />
            </div>

            <div>
              <label htmlFor="specialization">Specialization</label>
              <Field type="text" name="specialization" id="specialization"  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                <ErrorMessage name="specialization" component="div" className="text-red-500 text-xs" />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <Field type="email" name="email" id="email" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
            </div>

            <div>
              <label htmlFor="address">Address</label>
              <Field type="text" name="address" id="address" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                <ErrorMessage name="address" component="div" className="text-red-500 text-xs" />
            </div>

            <div>
              <label htmlFor="contactInfo.phone">Phone</label>
              <Field type="text" name="contactInfo.phone" id="contactInfo.phone" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                <ErrorMessage name="contactInfo.phone" component="div" className="text-red-500 text-xs" />

            </div>

            <div>
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <Field type="date" name="dateOfBirth" id="dateOfBirth" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 text-xs" />
            </div>

            <div>
              <label htmlFor="salary">Salary</label>
              <Field type="number" name="salary" id="salary" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                <ErrorMessage name="salary" component="div" className="text-red-500 text-xs" />
            </div>
              {/* Only show password field when creating a new teacher */}
              {!teacher && (
                  <div>
                      <label htmlFor="password">Password</label>
                      <Field
                          type="password"
                          name="password"
                          id="password"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      />
                      <ErrorMessage name="password" component="div" className="text-red-500 text-xs"/>
                  </div>
              )}


              <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  {isSubmitting ? 'Submitting...' : (teacher ? 'Update Teacher' : 'Create Teacher')}
              </button>
            {/* ... other fields ... */}
          </Form>
        )}
      </Formik>
    );
};

export default TeacherForm;