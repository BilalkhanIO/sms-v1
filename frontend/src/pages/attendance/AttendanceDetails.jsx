import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetAttendanceByIdQuery, useDeleteAttendanceMutation } from '../../api/attendanceApi';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import { Calendar, Users, Clock, Edit, Trash } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { format } from 'date-fns';
import Modal from '../../components/common/Modal';
import { useState } from 'react';

const AttendanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isTeacher, isAdmin } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: attendance, isLoading, error } = useGetAttendanceByIdQuery(id);
  const [deleteAttendance, { isLoading: isDeleting }] = useDeleteAttendanceMutation();

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  const handleDelete = async () => {
    try {
      await deleteAttendance(id).unwrap();
      navigate('/dashboard/attendance');
    } catch (error) {
      console.error('Failed to delete attendance:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'excused':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Attendance Details"
        backButton
      >
        {(isTeacher || isAdmin) && (
          <div className="flex space-x-4">
            <Link to={`/dashboard/attendance/${id}/edit`}>
              <Button variant="secondary">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </PageHeader>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Information */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {format(new Date(attendance.date), 'PPP')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Class</p>
                <p className="font-medium">{attendance.class.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Recorded By</p>
                <p className="font-medium">{attendance.recordedBy.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Records */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Student Records</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendance.records.map((record) => (
                  <tr key={record.studentId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record.student.firstName} {record.student.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {record.student.rollNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(record.status)}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.remarks || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Notes */}
        {attendance.notes && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Notes</h3>
            <p className="text-gray-600 whitespace-pre-line">{attendance.notes}</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Attendance Record"
      >
        <div className="p-6">
          <p className="text-gray-600">
            Are you sure you want to delete this attendance record? This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end space-x-4">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AttendanceDetails; 