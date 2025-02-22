// frontend/src/components/RoleModal.jsx
import React from "react";
import { Save, XCircle, Loader2 } from 'lucide-react';
import {useUpdateUserRoleMutation} from "../../api/usersApi.js";

const RoleModal = ({ isOpen, onClose, userId, initialRole }) => {
    const [newRole, setNewRole] = React.useState(initialRole);
    const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();

    React.useEffect(() => {
        setNewRole(initialRole);
    }, [initialRole]);

    const handleRoleUpdateSubmit = async () => {
        try {
            await updateUserRole({ id: userId, role: newRole }).unwrap();
            onClose(); // Close modal on successful update
        } catch (err) {
            console.error("Error updating role:", err);
            // Handle error feedback (e.g., toast notification)
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Update Role
                                </h3>
                                <div className="mt-2">
                                    <select
                                        value={newRole}
                                        onChange={(e) => setNewRole(e.target.value)}
                                        className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        <option value="SUPER_ADMIN">Super Admin</option>
                                        <option value="SCHOOL_ADMIN">School Admin</option>
                                        <option value="TEACHER">Teacher</option>
                                        <option value="STUDENT">Student</option>
                                        <option value="PARENT">Parent</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={handleRoleUpdateSubmit}
                            disabled={isUpdatingRole}
                        >
                            {isUpdatingRole ? (
                                <>
                                    <Loader2 size={16} className="animate-spin mr-2" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save size={16} className="mr-2" />
                                    Update
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            <XCircle size={16} className="mr-2" />
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleModal;