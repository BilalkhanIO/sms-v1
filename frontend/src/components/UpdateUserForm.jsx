// src/components/UpdateUserForm.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../api/usersApi";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputField from "./forms/InputField";
import SelectField from "./forms/SelectField";
import PageHeader from "./common/PageHeader";
import { ArrowLeft, Save, Loader2, XCircle } from "lucide-react";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  // Removed password from here as this update.
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
  // Add validation for role-specific fields here, as needed.  Example:
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

const UpdateUserForm = () => {
  const { id: userId } = useParams();
  const {
    data: user,
    isLoading: isFetchingUser,
    isError: isFetchError,
    refetch,
  } = useGetUserByIdQuery(userId); // Get user data
  const [
    updateUser,
    { isLoading: isUpdating, isSuccess, isError, error, reset },
  ] = useUpdateUserMutation(); // Get update mutation
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    if (user) {
      let userData = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "", // Email usually isn't changed in an update form
        role: user.role || "",
        status: user.status || "",
      };

      if (user.role === "TEACHER") {
        userData = {
          ...userData,
          employeeId: user.teacherDetails?.employeeId || "",
          qualification: user.teacherDetails?.qualification || "",
          specialization: user.teacherDetails?.specialization || "",
        };
      } else if (user.role === "STUDENT") {
        userData = {
          ...userData,
          admissionNumber: user.studentDetails?.admissionNumber || "",
          rollNumber: user.studentDetails?.rollNumber || "",
          class: user.studentDetails?.class || "",
          gender: user.studentDetails?.gender || "",
          dateOfBirth: user.studentDetails?.dateOfBirth || "",
        };
      } else if (user.role === "PARENT") {
        userData = {
          ...userData,
          contactNumber: user.parentDetails?.contactNumber || "",
        };
      }
      setInitialValues(userData);
    }
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      alert("User updated successfully!"); // Use a better notification
      reset();
      navigate(`/dashboard/users/${userId}`); // Go back to user details
    }
    if (isError) {
      alert(`Error updating user: ${error.data?.message || "Unknown error"}`);
    }
  }, [isSuccess, isError, navigate, userId, reset, error]);

  if (isFetchingUser || !initialValues) {
    return <div>Loading...</div>; // Show loading indicator
  }

  if (isFetchError) {
    return <div>Error fetching user data.</div>; // Show error message
  }
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updateUser({ id: userId, ...values }).unwrap();
      refetch(); // Refetch user data after update
    } catch (err) {
      console.error("Failed to update user", err);
      // Error already handled in useEffect.
    } finally {
      setSubmitting(false);
    }
  };

  // Conditional Fields based on role (using Formik's <Field>)
  const roleSpecificFields = (role, values, setFieldValue, errors, touched) => {
    // Add setFieldValue

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
            {/* ... other student fields */}
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
      <PageHeader title="Update User" />
      <div className="container mx-auto p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {(
            { isSubmitting, values, setFieldValue, errors, touched } // Destructure setFieldValue
          ) => (
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
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-xs italic"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Role:
                </label>
                <Field
                  as="select"
                  name="role"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled
                >
                  {" "}
                  {/* Role might not be editable in edit form */}
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

              {roleSpecificFields(
                values.role,
                values,
                setFieldValue,
                errors,
                touched
              )}

              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" /> Update User
                    </>
                  )}
                </button>
                <Link
                  to={`/dashboard/users/`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <XCircle size={16} className="mr-2" /> Cancel
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default UpdateUserForm;
