// frontend/src/components/UserList.js (Example component for displaying users - Admin only)
import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserRoleMutation } from "../api/usersApi";
import { useState } from "react";

const UserList = () => {
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");
    const { data: users, isLoading, error } = useGetUsersQuery({ role, status }); // Pass role and status
    const [deleteUser] = useDeleteUserMutation();
    const [updateUserRole] = useUpdateUserRoleMutation();
    const [userToUpdateRole, setUserToUpdateRole] = useState(null);
    const [newRole, setNewRole] = useState("");

    const handleDelete = async (id) => {
        try {
            await deleteUser(id).unwrap();
            // Optionally, you could refetch the users here, but RTK Query should handle it with invalidation
        } catch (err) {
            console.error("Error deleting user:", err);
            // Handle error (e.g., display error message)
        }
    };

    const handleUpdateRole = () => {
        updateUserRole({ id: userToUpdateRole, role: newRole })
            .unwrap()
            .then(() => {
                setUserToUpdateRole(null);
                setNewRole("");
            })
            .catch((error) => console.error(error));
    };

    if (isLoading) {
        return <div>Loading users...</div>;
    }

    if (error) {
        return <div>Error loading users: {error.message}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">User List</h2>

            {/* Filtering */}
            <div className="mb-4 flex space-x-4">
                <select
                    className="border p-2 rounded"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="">All Roles</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="SCHOOL_ADMIN">School Admin</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="STUDENT">Student</option>
                </select>
                <select
                    className="border p-2 rounded"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="PENDING">Pending</option>
                </select>
            </div>

            <table className="min-w-full border border-collapse">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border p-2">ID</th>
                    <th className="border p-2">First Name</th>
                    <th className="border p-2">Last Name</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Role</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user._id}>
                        <td className="border p-2">{user._id}</td>
                        <td className="border p-2">{user.firstName}</td>
                        <td className="border p-2">{user.lastName}</td>
                        <td className="border p-2">{user.email}</td>
                        <td className="border p-2">{user.role}</td>
                        <td className="border p-2">{user.status}</td>
                        <td className="border p-2 flex space-x-2">
                            <button
                                onClick={() => handleDelete(user._id)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => {
                                    setUserToUpdateRole(user._id);
                                    setNewRole(user.role); // Pre-fill with current role
                                }}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                            >
                                Update Role
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Update Role Modal/Form */}
            {userToUpdateRole && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                    <div className="bg-white p-4 rounded">
                        <h3 className="text-lg font-bold mb-2">Update Role</h3>
                        <select
                            className="border p-2 rounded mb-2"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                        >
                            <option value="SUPER_ADMIN">Super Admin</option>
                            <option value="SCHOOL_ADMIN">School Admin</option>
                            <option value="TEACHER">Teacher</option>
                            <option value="STUDENT">Student</option>
                        </select>
                        <div className="flex justify-end">
                            <button
                                onClick={handleUpdateRole}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setUserToUpdateRole(null)}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;