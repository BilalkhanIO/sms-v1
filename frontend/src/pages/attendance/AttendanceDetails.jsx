import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetAttendanceByIdQuery, useDeleteAttendanceMutation } from '../../api/attendanceApi';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import { Calendar, Users, Clock, Trash } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Modal from '../../components/common/Modal';

const AttendanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { can } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: attRaw, isLoading, error } = useGetAttendanceByIdQuery(id);
  const [deleteAttendance, { isLoading: isDeleting }] = useDeleteAttendanceMutation();
  const attendance = attRaw?.data || attRaw;

  if (isLoading) return <Spinner size="large" />;
  if (error || !attendance) return <div className="text-red-500 p-4">Attendance record not found.</div>;

  const handleDelete = async () => {
    try {
      await deleteAttendance(id).unwrap();
      navigate('/dashboard/attendance');
    } catch (err) {
      console.error('Failed to delete attendance:', err);
    }
  };

  const getStatusColor = (status) => {
    switch ((status || '').toUpperCase()) {
      case 'PRESENT': return 'bg-green-100 text-green-800';
      case 'ABSENT': return 'bg-red-100 text-red-800';
      case 'LATE': return 'bg-yellow-100 text-yellow-800';
      case 'EXCUSED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const records = attendance.records || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="Attendance Details" backUrl="/dashboard/attendance">
        {can('attendance', 'edit') && (
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </Button>
        )}
      </PageHeader>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {attendance.date ? new Date(attendance.date).toLocaleDateString() : '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Class</p>
                <p className="font-medium">{attendance.class?.name || '—'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Recorded By</p>
                <p className="font-medium">
                  {attendance.recordedBy?.firstName
                    ? `${attendance.recordedBy.firstName} ${attendance.recordedBy.lastName || ''}`
                    : attendance.recordedBy?.name || '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Student Records ({records.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record, i) => (
                  <tr key={record.studentId || record._id || i}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record.student?.user?.firstName || record.student?.firstName || '—'}{' '}
                        {record.student?.user?.lastName || record.student?.lastName || ''}
                      </div>
                      <div className="text-sm text-gray-500">{record.student?.rollNumber || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(record.status)}`}>
                        {record.status || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.remarks || '—'}
                    </td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {attendance.notes && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
            <p className="text-gray-600 whitespace-pre-line">{attendance.notes}</p>
          </div>
        )}
      </div>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Attendance Record">
        <div className="p-6">
          <p className="text-gray-600">Are you sure you want to delete this attendance record? This action cannot be undone.</p>
          <div className="mt-6 flex justify-end space-x-4">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AttendanceDetails;
