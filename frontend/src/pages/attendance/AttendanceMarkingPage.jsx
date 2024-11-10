import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendance, markAttendance } from '../../redux/features/attendanceSlice';
import { fetchStudents } from '../../redux/features/studentSlice';
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline';

const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
};

const AttendanceMarkingPage = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceData, setAttendanceData] = useState({});

  const dispatch = useDispatch();
  const { students } = useSelector((state) => state.students);
  const { loading, records } = useSelector((state) => state.attendance);

  useEffect(() => {
    if (selectedClass) {
      dispatch(fetchStudents({ classId: selectedClass }));
      dispatch(fetchAttendance({ classId: selectedClass, date: selectedDate }));
    }
  }, [selectedClass, selectedDate, dispatch]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = async () => {
    await dispatch(
      markAttendance({
        classId: selectedClass,
        date: selectedDate,
        attendanceData,
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Mark Attendance</h1>
        <div className="flex space-x-4">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select Class</option>
            {/* Add class options */}
          </select>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      {selectedClass && (
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
                    <div className="text-sm text-gray-900">{student.rollNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() =>
                          handleStatusChange(student.id, ATTENDANCE_STATUS.PRESENT)
                        }
                        className={`p-2 rounded-full ${
                          attendanceData[student.id] === ATTENDANCE_STATUS.PRESENT
                            ? 'bg-green-100 text-green-600'
                            : 'text-gray-400 hover:text-green-600'
                        }`}
                      >
                        <CheckCircleIcon className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(student.id, ATTENDANCE_STATUS.ABSENT)
                        }
                        className={`p-2 rounded-full ${
                          attendanceData[student.id] === ATTENDANCE_STATUS.ABSENT
                            ? 'bg-red-100 text-red-600'
                            : 'text-gray-400 hover:text-red-600'
                        }`}
                      >
                        <XCircleIcon className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(student.id, ATTENDANCE_STATUS.LATE)
                        }
                        className={`p-2 rounded-full ${
                          attendanceData[student.id] === ATTENDANCE_STATUS.LATE
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'text-gray-400 hover:text-yellow-600'
                        }`}
                      >
                        <ClockIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedClass && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceMarkingPage; 