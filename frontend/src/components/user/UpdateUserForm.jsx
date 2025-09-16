import React from "react";
import PageHeader from "../common/PageHeader";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../../api/usersApi";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Input from "../common/Input";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
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
});

const UpdateUserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const { data: user, isLoading, error } = useGetUserByIdQuery(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Error loading user: {error.data?.message || "Unknown error"}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center">
        <p>User not found</p>
        <Link to="/dashboard/users" className="text-blue-500 hover:underline">
          Back to Users
        </Link>
      </div>
    );
  }

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await updateUser({ id, ...values }).unwrap();
      navigate("/dashboard/users");
    } catch (error) {
      if (error.data?.errors) {
        error.data.errors.forEach((err) => {
          setFieldError(err.field, err.message);
        });
      } else {
        setFieldError("general", error.data?.message || "Update failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="Update User" backUrl="/dashboard/users" />
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <Formik
          initialValues={{
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            role: user.role || "",
            status: user.status || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {errors.general}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Field
                    as={Input}
                    label="First Name"
                    name="firstName"
                    id="firstName"
                    placeholder="Enter first name"
                  />
                  <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <Field
                    as={Input}
                    label="Last Name"
                    name="lastName"
                    id="lastName"
                    placeholder="Enter last name"
                  />
                  <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>

              <div>
                <Field
                  as={Input}
                  label="Email"
                  name="email"
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <Field
                    as="select"
                    name="role"
                    id="role"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Role</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="SCHOOL_ADMIN">School Admin</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="STUDENT">Student</option>
                    <option value="PARENT">Parent</option>
                  </Field>
                  <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <Field
                    as="select"
                    name="status"
                    id="status"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="PENDING_EMAIL_VERIFICATION">Pending Email Verification</option>
                    <option value="PENDING_ADMIN_APPROVAL">Pending Admin Approval</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="DELETED">Deleted</option>
                  </Field>
                  <ErrorMessage name="status" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Link
                  to="/dashboard/users"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting || isUpdating}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {(isSubmitting || isUpdating) ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Update User
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateUserForm;