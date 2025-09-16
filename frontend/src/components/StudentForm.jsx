// src/components/StudentForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useCreateStudentMutation, useUpdateStudentMutation } from '../api/studentApi';

const FILE_SIZE = 1024 * 1024; // 1MB
const SUPPORTED_IMAGE_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
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
    profileImage: Yup.mixed()
        .test('fileSize', 'File too large', value => 
            !value || (value && value.size <= FILE_SIZE))
        .test('fileFormat', 'Unsupported Format', value => 
            !value || (value && SUPPORTED_IMAGE_FORMATS.includes(value.type)))
});

const StudentForm = ({ student }) => { // Receive student as a prop
    const navigate = useNavigate();
    const [createStudent] = useCreateStudentMutation();
    const [updateStudent] = useUpdateStudentMutation();
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedGuardian, setSelectedGuardian] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const initialValues = {
        firstName: student?.firstName || '',
        lastName: student?.lastName || '',
        admissionNumber: student?.admissionNumber || '',
        rollNumber: student?.rollNumber || '',
        class: student?.class?._id || '',
        dateOfBirth: student?.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
        gender: student?.gender || '',
        parentInfo: {
            guardian: student?.parentInfo?.guardian?._id || '',
        },
        address: {
            street: student?.address?.street || '',
            city: student?.address?.city || '',
            state: student?.address?.state || '',
            postalCode: student?.address?.postalCode || '',
            country: student?.address?.country || '',
        },
        profileImage: null,
    };

    useEffect(() => {
        if (student) {
            setSelectedClass({
                value: student.class._id,
                label: `${student.class.name} - ${student.class.section}`
            });
            if (student.parentInfo?.guardian) {
                setSelectedGuardian({
                    value: student.parentInfo.guardian._id,
                    label: `${student.parentInfo.guardian.user.firstName} ${student.parentInfo.guardian.user.lastName}`
                });
            }
            if (student.profileImage) {
                setPreviewImage(student.profileImage);
            }
        }
    }, [student]);

    const loadParents = async (inputValue) => {
        try {
            const response = await fetch(`/api/users/parents?search=${inputValue}`);
            const data = await response.json();
            return data.map(parent => ({
                value: parent._id,
                label: `${parent.firstName} ${parent.lastName}`
            }));
        } catch (error) {
            console.error("Error loading parents:", error);
            return [];
        }
    };

    const loadClasses = async (inputValue) => {
        try {
            const response = await fetch(`/api/classes?search=${inputValue}`);
            const data = await response.json();
            return data.map(cls => ({
                value: cls._id,
                label: `${cls.name} - ${cls.section}`
            }));
        } catch (error) {
            console.error("Error loading classes:", error);
            return [];
        }
    };

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const formData = new FormData();
            
            // Append all form fields to FormData
            Object.keys(values).forEach(key => {
                if (key === 'profileImage' && values[key]) {
                    formData.append('profileImage', values[key]);
                } else if (key === 'parentInfo') {
                    formData.append('parentInfo[guardian]', values[key].guardian);
                } else if (key === 'address') {
                    Object.keys(values[key]).forEach(addressKey => {
                        formData.append(`address[${addressKey}]`, values[key][addressKey]);
                    });
                } else {
                    formData.append(key, values[key]);
                }
            });

            if (student) {
                await updateStudent({ id: student._id, data: formData }).unwrap();
            } else {
                await createStudent(formData).unwrap();
            }
            navigate('/students');
        } catch (error) {
            console.error("Error submitting form:", error);
            setErrors({ submit: error.message });
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {({ values, isSubmitting, setFieldValue, errors, touched }) => (
                <Form className="space-y-6 max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Profile Image Upload */}
                        <div className="md:col-span-2">
                            <div className="flex items-center space-x-6">
                                <div className="w-24 h-24 relative">
                                    <img
                                        src={previewImage || '/default-avatar.png'}
                                        alt="Profile Preview"
                                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => {
                                            const file = event.currentTarget.files[0];
                                            setFieldValue('profileImage', file);
                                            setPreviewImage(URL.createObjectURL(file));
                                        }}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    <ErrorMessage name="profileImage" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                            <Field
                                type="text"
                                name="firstName"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            <ErrorMessage name="firstName" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                            <Field
                                type="text"
                                name="lastName"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            <ErrorMessage name="lastName" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div>
                            <label htmlFor="admissionNumber" className="block text-sm font-medium text-gray-700">Admission Number</label>
                            <Field
                                type="text"
                                name="admissionNumber"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            <ErrorMessage name="admissionNumber" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div>
                            <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700">Roll Number</label>
                            <Field
                                type="text"
                                name="rollNumber"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            <ErrorMessage name="rollNumber" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div>
                            <label htmlFor="class" className="block text-sm font-medium text-gray-700">Class</label>
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                loadOptions={loadClasses}
                                value={selectedClass}
                                onChange={(option) => {
                                    setSelectedClass(option);
                                    setFieldValue('class', option.value);
                                }}
                                className="mt-1"
                            />
                            <ErrorMessage name="class" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div>
                            <label htmlFor="guardian" className="block text-sm font-medium text-gray-700">Guardian</label>
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                loadOptions={loadParents}
                                value={selectedGuardian}
                                onChange={(option) => {
                                    setSelectedGuardian(option);
                                    setFieldValue('parentInfo.guardian', option.value);
                                }}
                                className="mt-1"
                            />
                            <ErrorMessage name="parentInfo.guardian" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div>
                            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                            <Field
                                type="date"
                                name="dateOfBirth"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                            <Field
                                as="select"
                                name="gender"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Select Gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </Field>
                            <ErrorMessage name="gender" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        {/* Address Information */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">Street</label>
                                    <Field
                                        type="text"
                                        name="address.street"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    <ErrorMessage name="address.street" component="div" className="text-red-500 text-xs mt-1" />
                                </div>

                                <div>
                                    <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">City</label>
                                    <Field
                                        type="text"
                                        name="address.city"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    <ErrorMessage name="address.city" component="div" className="text-red-500 text-xs mt-1" />
                                </div>

                                <div>
                                    <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">State</label>
                                    <Field
                                        type="text"
                                        name="address.state"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    <ErrorMessage name="address.state" component="div" className="text-red-500 text-xs mt-1" />
                                </div>

                                <div>
                                    <label htmlFor="address.postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                                    <Field
                                        type="text"
                                        name="address.postalCode"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    <ErrorMessage name="address.postalCode" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                
                                <div>
                                    <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">Country</label>
                                    <Field
                                        type="text"
                                        name="address.country"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    <ErrorMessage name="address.country" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigate('/students')}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : student ? 'Update Student' : 'Create Student'}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default StudentForm;
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