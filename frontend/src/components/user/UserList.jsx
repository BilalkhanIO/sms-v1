import React, { useCallback, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import { Trash2, Eye, Edit, UserPlus, Search, ChevronDown } from "lucide-react";
import { useGetUsersQuery, useDeleteUserMutation } from "../../api/usersApi.js";
import RoleModal from "./RoleModal.jsx";
import StatusModal from "./StatusModal.jsx";
import Spinner from "../common/Spinner.jsx";
import ErrorMessage from "../common/ErrorMessage.jsx";
import PageHeader from "../common/PageHeader.jsx";

const UserList = () => {
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [localSearchTerm, setLocalSearchTerm] = useState(""); // Local state for input

  const {
    data: users,
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
  );

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({});

  // Debounced setSearchTerm function
  const debounceSetSearchTerm = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  // Update searchTerm using debounce when localSearchTerm changes
  useEffect(() => {
    debounceSetSearchTerm(localSearchTerm);
  }, [localSearchTerm, debounceSetSearchTerm]);

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
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>Role</span>
                    <div className="relative">
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="appearance-none bg-transparent border-none text-gray-700 focus:outline-none cursor-pointer pl-1 pr-6 py-1 rounded"
                      >
                        <option value="">All</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                        <option value="SCHOOL_ADMIN">School Admin</option>
                        <option value="TEACHER">Teacher</option>
                        <option value="STUDENT">Student</option>
                        <option value="PARENT">Parent</option>
                      </select>
                      <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="appearance-none bg-transparent border-none text-gray-700 focus:outline-none cursor-pointer pl-1 pr-6 py-1 rounded"
                      >
                        <option value="">All</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="PENDING">Pending</option>
                      </select>
                      <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users?.data?.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/dashboard/users/${user._id}`}
                      className="hover:underline text-blue-600"
                    >
                      {user.firstName} {user.lastName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td
                    className="px-6 py-4 whitespace-nowrap cursor-pointer relative group"
                    onClick={() => handleRoleUpdate(user._id, user.role)}
                  >
                    <span
                      className={`cursor-pointer group-hover:underline inline-block px-2 py-1 rounded-full text-xs font-semibold ${getRoleBadgeClasses(
                        user.role
                      )} text-center`}
                    >
                      {formatRoleText(user.role)}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap cursor-pointer relative group"
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
                  <td className="px-6 py-4 whitespace-nowrap flex space-x-2 justify-end">
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
