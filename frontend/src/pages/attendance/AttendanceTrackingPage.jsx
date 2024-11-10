import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents } from '../../redux/features/studentSlice';
import { markAttendance, fetchAttendanceStats } from '../../redux/features/attendanceSlice';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
} from '@heroicons/react/outline';

const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
};

const AttendanceTrackingPage = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceData, setAttendanceData] = useState({});
  const [bulkAction, setBulkAction] = useState('');

  const dispatch = useDispatch();
  const { students, loading: studentsLoading } = useSelector((state) => state.student);
  const { stats, loading: attendanceLoading } = useSelector((state) => state.attendance);
  const { classes } = useSelector((state) => state.class);

  useEffect(() => {
    if (selectedClass) {
      dispatch(fetchStudents({ classId: selectedClass }));
      dispatch(fetchAttendanceStats({ classId: selectedClass, date: selectedDate }));
    }
  }, [selectedClass, selectedDate, dispatch]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleBulkAction = () => {
    if (!bulkAction) return;
    
    const newAttendanceData = {};
    students.forEach((student) => {
      newAttendanceData[student.id] = bulkAction;
    });
    setAttendanceData(newAttendanceData);
  };

  const handleSubmit = async () => {
    try {
      await dispatch(markAttendance({
        classId: selectedClass,
        date: selectedDate,
        attendanceData,
      })).unwrap();
      
      // Reset form or show success message
    } catch (error) {
      // Handle error
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case ATTENDANCE_STATUS.PRESENT:
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case ATTENDANCE_STATUS.ABSENT:
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case ATTENDANCE_STATUS.LATE:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Attendance Tracking</h1>
        <div className="flex space-x-4">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} - {cls.section}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Present</h3>
              <p className="text-2xl font-semibold text-green-600">
                {stats.presentCount || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <XCircleIcon className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Absent</h3>
              <p className="text-2xl font-semibold text-red-600">
                {stats.absentCount || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Late</h3>
              <p className="text-2xl font-semibold text-yellow-600">
                {stats.lateCount || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Attendance Rate
              </h3>
              <p className="text-2xl font-semibold text-blue-600">
                {stats.attendanceRate || 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedClass && (
        <>
          {/* Bulk Actions */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex space-x-4">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Bulk Action</option>
                <option value={ATTENDANCE_STATUS.PRESENT}>Mark All Present</option>
                <option value={ATTENDANCE_STATUS.ABSENT}>Mark All Absent</option>
                <option value={ATTENDANCE_STATUS.LATE}>Mark All Late</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roll Number
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={student.avatar || 'https://via.placeholder.com/40'}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.rollNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center space-x-4">
                        {Object.values(ATTENDANCE_STATUS).map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(student.id, status)}
                            className={`p-2 rounded-full ${
                              attendanceData[student.id] === status
                                ? 'bg-gray-100'
                                : ''
                            }`}
                          >
                            {getStatusIcon(status)}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={studentsLoading || attendanceLoading}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {studentsLoading || attendanceLoading
                ? 'Saving...'
                : 'Save Attendance'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AttendanceTrackingPage; 