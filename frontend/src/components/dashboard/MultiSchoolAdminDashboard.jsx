import React, { useState } from 'react';
import { useGetSchoolsQuery } from '../../api/schoolApi';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import ManageAdminsModal from './ManageAdminsModal';

const SchoolCard = ({ school, onManageAdmins }) => (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col justify-between">
        <div>
            <h3 className="text-lg font-bold">{school.name}</h3>
            <p className="text-sm text-gray-600">{school.address}</p>
        </div>
        <button
            onClick={() => onManageAdmins(school)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            Manage Admins
        </button>
    </div>
);

const MultiSchoolAdminDashboard = () => {
    const { data: schools, isLoading, isError, error } = useGetSchoolsQuery();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState(null);

    const handleManageAdmins = (school) => {
        setSelectedSchool(school);
        setIsModalOpen(true);
    };

    if (isLoading) {
        return <Spinner size="large" />;
    }

    if (isError) {
        return (
            <ErrorMessage>
                Error: {error.data?.message || error.error || 'Failed to load schools'}
            </ErrorMessage>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Multi-School Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schools?.map((school) => (
                    <SchoolCard key={school._id} school={school} onManageAdmins={handleManageAdmins} />
                ))}
            </div>
            {isModalOpen && (
                <ManageAdminsModal
                    school={selectedSchool}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default MultiSchoolAdminDashboard;
