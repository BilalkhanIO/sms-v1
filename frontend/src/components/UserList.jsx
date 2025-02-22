// src/components/UserList.jsx

import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import { Trash2, Eye, Edit, UserPlus, Search } from "lucide-react"; // More Lucide Icons
import { useGetUsersQuery, useDeleteUserMutation } from "../api/usersApi";
import RoleModal from "../components/user/RoleModal.jsx";
import StatusModal from "../components/user/StatusModal.jsx";
import Spinner from "./common/Spinner";
import ErrorMessage from "./common/ErrorMessage";
import PageHeader from "./common/PageHeader";

const UserList = () => {
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: users, // Correctly access and rename the data
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUsersQuery(
    {
      role: roleFilter,
      status: statusFilter,
      search: searchTerm,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  ); // Fetch on component mount

  console.log(`User: ${roleFilter} and User: ${statusFilter}`);

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [userForModal, setUserForModal] = useState(null);
  const [modalProps, setModalProps] = useState({});

  // Debounced setSearchTerm function
  const debounceSetSearchTerm = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const handleSearchTermChange = (e) => {
    debounceSetSearchTerm(e.target.value);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
        refetch(); // Refetch after successful deletion
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  const handleRoleUpdate = (userId, currentRole) => {
    setModalProps({ userId, initialRole: currentRole });
    setIsRoleModalOpen(true);
  };

  const handleStatusUpdate = (userId, currentStatus) => {
    setModalProps({ userId, initialStatus: currentStatus });
    setIsStatusModalOpen(true);
  };

  const closeRoleModal = () => {
    setIsRoleModalOpen(false);
    setModalProps({});
  };

  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
    setModalProps({});
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return (
      <ErrorMessage>
        Error: {error.data?.message || "Failed to load users"}
      </ErrorMessage>
    );
  }

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleBadgeClasses = (role) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-purple-100 text-purple-800";
      case "SCHOOL_ADMIN":
        return "bg-blue-100 text-blue-800";
      case "TEACHER":
        return "bg-teal-100 text-teal-800";
      case "STUDENT":
        return "bg-orange-100 text-orange-800";
      case "PARENT":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800"; // Default for unknown roles
    }
  };

  // Helper function to format role text
  const formatRoleText = (role) => {
    return role
      .replace(/_/g, " ") // Replace underscores with spaces
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(" ");
  };

  return (
    <>
      <PageHeader title="User Management" />
      <div className="container mx-auto p-6">
        {/* Controls: Search, Filters, Create Button in one line */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search by name or email..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={handleSearchTermChange} // Use the new handler
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-2">
            <div className="inline-block relative">
              <select
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="SCHOOL_ADMIN">School Admin</option>
                <option value="TEACHER">Teacher</option>
                <option value="STUDENT">Student</option>
                <option value="PARENT">Parent</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <div className="inline-block relative">
              <select
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="PENDING">Pending</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Create User Button - Text and Icon */}
          <div>
            <Link
              to="/dashboard/users/create"
              className="inline-flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              <UserPlus className="mr-2" size={16} />
              Create
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-md shadow-sm">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users &&
                users?.data.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Link
                        to={`/dashboard/users/${user._id}`}
                        className="hover:underline text-blue-600"
                      >
                        {user.firstName} {user.lastName}
                      </Link>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td
                      className="px-4 py-4 whitespace-nowrap cursor-pointer relative group"
                      onClick={() => handleRoleUpdate(user._id, user.role)}
                    >
                      <span
                        className={`cursor-pointer group-hover:underline inline-block px-2 py-1 rounded-full text-xs font-semibold ${getRoleBadgeClasses(
                          user.role
                        )} text-center`}
                      >
                        {formatRoleText(user.role)} {/* Formatted Role Text */}
                      </span>
                    </td>
                    <td
                      className="px-4 py-4 whitespace-nowrap cursor-pointer relative group"
                      onClick={() => handleStatusUpdate(user._id, user.status)}
                    >
                      <span
                        className={`cursor-pointer group-hover:underline inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClasses(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap flex space-x-2 justify-end">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isDeleting}
                      >
                        <Trash2 size={16} />
                      </button>
                      <Link
                        to={`/dashboard/users/${user._id}`}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        to={`/dashboard/users/edit/${user._id}`}
                        className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                      >
                        <Edit size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <RoleModal
          isOpen={isRoleModalOpen}
          onClose={closeRoleModal}
          userId={modalProps.userId}
          initialRole={modalProps.initialRole}
        />
        <StatusModal
          isOpen={isStatusModalOpen}
          onClose={closeStatusModal}
          userId={modalProps.userId}
          initialStatus={modalProps.initialStatus}
        />
      </div>
    </>
  );
};

export default UserList;
