// src/components/StudentForm.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createStudent, updateStudent } from '../store/studentSlice'; // Import actions
import { useNavigate } from 'react-router-dom';
import * as api from "../api"; // Import your API functions
import AsyncSelect from 'react-select/async'; // Import AsyncSelect
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    admissionNumber: Yup.string().required('Admission number is required'),
    rollNumber: Yup.string().required('Roll number is required'),
    class: Yup.string().required('Class is required'),
    dateOfBirth: Yup.date().required('Date of birth is required'),
    gender: Yup.string().required('Gender is required'),
    'parentInfo.guardian': Yup.string().required('Guardian is required'),
    'address.street': Yup.string().required('Street is required'),
    'address.city': Yup.string().required('City is required'),
    'address.state': Yup.string().required('State is required'),
    'address.postalCode': Yup.string().required('Postal code is required'),
    'address.country': Yup.string().required('Country is required'),
    // Add validation for other fields as needed
});

const StudentForm = ({ student }) => { // Receive student as a prop
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        admissionNumber: '',
        rollNumber: '',
        class: '', // Will be an ID
        dateOfBirth: '',
        gender: '',
        parentInfo: {
            father: { name: '', occupation: '', contact: '' },
            mother: { name: '', occupation: '', contact: '' },
            guardian: null, // Will be an ID
        },
        address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
        },
    });

    // Load initial data if editing
    useEffect(() => {
        if (student) {
            setFormData({
                admissionNumber: student.admissionNumber || '',
                rollNumber: student.rollNumber || '',
                class: student.class || '', // Should be class ID
                dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '', // Format date
                gender: student.gender || '',
                parentInfo: student.parentInfo || { father: {}, mother: {}, guardian: null },
                address: student.address || {},
            });
        }
    }, [student]);


    // Function to load parents for the AsyncSelect
    const loadParents = async (inputValue) => {
      try {
        const response = await api.usersApi.getUsers({ role: 'PARENT', search: inputValue });
        return response.data.map(parent => ({
          value: parent._id,  // Assuming _id is the parent's ID
          label: `${parent.firstName} ${parent.lastName}` // Display name
        }));
      } catch (error) {
        console.error("Error loading parents:", error);
        return [];
      }
    };

  const loadClasses = async (inputValue) => {
    try {
      const response = await api.classApi.getClasses();
      return response.data.map(cls => ({
        value: cls._id,  // Assuming _id is the parent's ID
        label: `${cls.name} - ${cls.section} ` // Display name
      }));
    } catch (error) {
      console.error("Error loading parents:", error);
      return [];
    }
  };

    const handleSubmit = async (values, {setSubmitting}) => {

        try {
            const studentData = {
                ...values,
                class: values.class, // Send class ID
                parentInfo: {
                  ...values.parentInfo,
                  guardian: values.parentInfo.guardian,
                },
            };
            if (student) {
                // Update
                await dispatch(updateStudent({ id: student._id, data: studentData })).unwrap();
            } else {
                // Create
                await dispatch(createStudent(studentData)).unwrap();
            }
            navigate('/dashboard/students'); // Redirect after success
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitting(false)
        }
    };

    return (
      <Formik
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, isSubmitting, setFieldValue, errors, touched }) => (
          <Form className="space-y-4">
            {/* ... (rest of your form fields) ... */}
            <div>
                <label htmlFor="admissionNumber" className="block text-sm font-medium text-gray-700">Admission Number</label>
                <Field type="text" name="admissionNumber" id="admissionNumber" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                <ErrorMessage name="admissionNumber" component="div" className="text-red-500 text-xs" />
            </div>
            <div>
                <label htmlFor="rollNumber">Roll Number</label>
                <Field type="text" name="rollNumber" id="rollNumber"  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                <ErrorMessage name="rollNumber" component="div" className="text-red-500 text-xs" />
            </div>
            <div>
                <label htmlFor="class">Class</label>
                <AsyncSelect
                    cacheOptions
                    defaultOptions
                    loadOptions={loadClasses}
                    getOptionValue={(option) => option.value}
                    getOptionLabel={(option) => option.label}
                    onChange={(option) => setFieldValue('class', option.value)}
                    value={values.class ? {value: values.class, label: values.classLabel} : null} //Keep selected value
                />
                <ErrorMessage name="class" component="div" className="text-red-500 text-xs" />
            </div>
            <div>
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <Field type="date" id="dateOfBirth" name="dateOfBirth" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 text-xs" />
            </div>

            <div>
              <label htmlFor="gender">Gender</label>
              <Field as="select" name="gender" id="gender"  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </Field>
                <ErrorMessage name="gender" component="div" className="text-red-500 text-xs" />
            </div>

            <div>
              <label htmlFor="guardian">Guardian:</label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={loadParents}
                  onChange={(option) => setFieldValue('parentInfo.guardian', option.value)}
                  value={values.parentInfo.guardian ? {value: values.parentInfo.guardian, label: values.parentLabel} : null} //Keep selected value

                />
                <ErrorMessage name="parentInfo.guardian" component="div" className="text-red-500 text-xs" />
            </div>

            <div>
                <label htmlFor="address.street">Street</label>
                <Field type="text" name="address.street" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                <ErrorMessage name="address.street" component="div" className="text-red-500 text-xs" />
            </div>
            <div>
                <label htmlFor="address.city">City</label>
                <Field type="text" name="address.city"  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                <ErrorMessage name="address.city" component="div" className="text-red-500 text-xs" />
            </div>
            <div>
                <label htmlFor="address.state">State</label>
                <Field type="text" name="address.state"  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                <ErrorMessage name="address.state" component="div" className="text-red-500 text-xs" />
            </div>

            <div>
                <label htmlFor="address.postalCode">Postal Code</label>
                <Field type="text" name="address.postalCode"  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                <ErrorMessage name="address.postalCode" component="div" className="text-red-500 text-xs" />
            </div>
            <div>
                <label htmlFor="address.country">Country</label>
                <Field type="text" name="address.country"  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                <ErrorMessage name="address.country" component="div" className="text-red-500 text-xs" />
            </div>
            {/* ... (other form fields) ... */}
            <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {isSubmitting ? 'Submitting...' : (student ? 'Update Student' : 'Create Student')}
            </button>
          </Form>
        )}
      </Formik>
    );
};

export default StudentForm;