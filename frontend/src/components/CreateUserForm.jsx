// src/components/CreateUserForm.jsx (Formik Version)

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useCreateUserMutation } from "../api/usersApi"; // Import RTK Query hook
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik"; // Import Formik components
import * as Yup from "yup";
import InputField from "./forms/InputField";
import SelectField from "./forms/SelectField";
import PageHeader from "./common/PageHeader";
import { ArrowLeft, Loader2, Save } from "lucide-react";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  role: Yup.string()
    .oneOf(
      ["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT", "PARENT"],
      "Invalid role"
    )
    .required("Role is required"),
  status: Yup.string()
    .oneOf(
      [
        "ACTIVE",
        "INACTIVE",
        "PENDING_EMAIL_VERIFICATION",
        "PENDING_ADMIN_APPROVAL",
        "SUSPENDED",
        "DELETED",
      ],
      "Invalid Status"
    )
    .required("Status is required"),
  employeeId: Yup.string().when("role", {
    is: "TEACHER",
    then: () => Yup.string().required("Employee ID is required for teachers"),
    otherwise: () => Yup.string().notRequired(),
  }),
  admissionNumber: Yup.string().when("role", {
    is: "STUDENT",
    then: () =>
      Yup.string().required("Admission Number is required for students"),
    otherwise: () => Yup.string().notRequired(),
  }),
});

const CreateUserForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createUser, { isLoading, isSuccess, isError, error, reset }] =
    useCreateUserMutation(); // Use the RTK Query hook

  // Initial form values
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "STUDENT", // Default role
    status: "PENDING_ADMIN_APPROVAL",
    employeeId: "", // Teacher
    qualification: "", // Teacher
    specialization: "", // Teacher
    admissionNumber: "", // Student
    rollNumber: "", // Student
    class: "", // Student (will be a class ID)
    gender: "", // Student
    dateOfBirth: "", // Student
    contactNumber: "", // Parent
  };

  useEffect(() => {
    if (isSuccess) {
      alert("User created successfully! Redirecting to user list."); // Show success message
      reset();
      navigate("/dashboard/users");
    }
    if (isError) {
      alert(`Error creating user: ${error.data?.message || error.message || "Unknown Error"}`);
    }
  }, [isSuccess, isError, navigate, reset, error]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await createUser(values).unwrap();
    } catch (err) {
      console.error("Create user failed", err);
      // Error already handled
    } finally {
      setSubmitting(false);
    }
  };

  // Conditional Fields based on role (using Formik's <Field>)
  const roleSpecificFields = (role) => {
    switch (role) {
      case "TEACHER":
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Employee ID
              </label>
              <Field
                type="text"
                name="employeeId"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage
                name="employeeId"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>
            {/* ... other teacher fields */}
          </>
        );
      case "STUDENT":
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Admission Number
              </label>
              <Field
                type="text"
                name="admissionNumber"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage
                name="admissionNumber"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>
          </>
        );
      case "PARENT":
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Contact Number
              </label>
              <Field
                type="text"
                name="contactNumber"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage
                name="contactNumber"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <PageHeader title="Create User" />
      <div className="container mx-auto p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values }) => (
            <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <InputField
                label="First Name"
                name="firstName"
                type="text"
                required
              />
              <InputField
                label="Last Name"
                name="lastName"
                type="text"
                required
              />
              <InputField label="Email" name="email" type="email" required />
              <InputField
                label="Password"
                name="password"
                type="password"
                required
              />

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Role:
                </label>
                <Field
                  as="select"
                  name="role"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="PARENT">Parent</option>
                  <option value="SCHOOL_ADMIN">School Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </Field>
                <ErrorMessage
                  name="role"
                  component="div"
                  className="text-red-500 text-xs italic"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Status:
                </label>
                <Field
                  as="select"
                  name="status"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="PENDING">Pending</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  {/* Add other statuses if needed */}
                </Field>
                <ErrorMessage
                  name="status"
                  component="div"
                  className="text-red-500 text-xs italic"
                />
              </div>

              {roleSpecificFields(values.role)}

              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" /> Create User
                    </>
                  )}
                </button>
                <Link
                  to="/dashboard/users"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <ArrowLeft size={16} className="mr-2" /> Back to Users
                </Link>
              </div>
            </Form>
          )}
        </Formik>
        {/* No need for separate error display; Formik handles it */}
      </div>
    </>
  );
};

export default CreateUserForm;
