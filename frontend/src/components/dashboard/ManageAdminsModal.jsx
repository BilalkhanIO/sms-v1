import React, { useState } from 'react';
import { useGetUsersQuery } from '../../api/usersApi';
import { useAssignSchoolAdminMutation } from '../../api/usersApi';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';

const ManageAdminsModal = ({ school, onClose }) => {
    const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery({ role: 'SCHOOL_ADMIN' });
    const [assignSchoolAdmin, { isLoading: isAssigning, error }] = useAssignSchoolAdminMutation();
    const [selectedAdmin, setSelectedAdmin] = useState(school.admin?._id || '');

    const handleAssignAdmin = async () => {
        if (selectedAdmin) {
            try {
                await assignSchoolAdmin({ userId: selectedAdmin, schoolId: school._id }).unwrap();
                onClose();
            } catch (err) {
                // The error is handled by the `error` property from the hook
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Manage Admins for {school.name}</h2>
                {isLoadingUsers ? (
                    <Spinner />
                ) : (
                    <select
                        value={selectedAdmin}
                        onChange={(e) => setSelectedAdmin(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select an Admin</option>
                        {users?.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user.firstName} {user.lastName}
                            </option>
                        ))}
                    </select>
                )}
                {error && (
                    <div className="mt-2">
                        <ErrorMessage>
                            {error.data?.message || error.error || 'Failed to assign admin'}
                        </ErrorMessage>
                    </div>
                )}
                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="mr-2 bg-gray-300 px-4 py-2 rounded">
                        Cancel
                    </button>
                    <button
                        onClick={handleAssignAdmin}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        disabled={isAssigning}
                    >
                        {isAssigning ? 'Assigning...' : 'Assign'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageAdminsModal;
