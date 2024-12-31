import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { markAttendance, getAttendanceReport } from '../../redux/features/studentSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { STUDENT_STATUS } from '../../constants/student';

const AttendanceTracking = () => {
  const dispatch = useDispatch();
  const { selectedClass, loading, error } = useSelector(state => state.class);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [view, setView] = useState('mark'); // 'mark' or 'report'

  useEffect(() => {
    if (selectedClass) {
      dispatch(getAttendanceReport({ classId: selectedClass._id, date }));
    }
  }, [dispatch, selectedClass, date]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        status,
        timestamp: new Date().toISOString()
      }
    }));
  };

  const handleSubmit = useCallback(async () => {
    try {
      await dispatch(markAttendance({
        classId: selectedClass._id,
        date,
        attendance: attendanceData
      })).unwrap();
      
      // Reset form after successful submission
      setAttendanceData({});
    } catch (error) {
      console.error('Failed to mark attendance:', error);
    }
  }, [dispatch, selectedClass, date, attendanceData]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Attendance Tracking</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setView('mark')}
            className={`px-4 py-2 rounded-md ${
              view === 'mark' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Mark Attendance
          </button>
          <button
            onClick={() => setView('report')}
            className={`px-4 py-2 rounded-md ${
              view === 'report' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            View Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-4 items-center">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {selectedClass && (
              <span className="text-gray-700">
                Class: {selectedClass.name} - {selectedClass.section}
              </span>
            )}
          </div>
        </div>

        {view === 'mark' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roll No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
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
                {selectedClass?.students?.map((student) => (
                  <tr key={student._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.rollNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={attendanceData[student._id]?.status || ''}
                        onChange={(e) => handleAttendanceChange(student._id, e.target.value)}
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select Status</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="excused">Excused</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        placeholder="Add remarks"
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={attendanceData[student._id]?.remarks || ''}
                        onChange={(e) => handleAttendanceChange(student._id, {
                          ...attendanceData[student._id],
                          remarks: e.target.value
                        })}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            {/* Attendance Report View */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="stats-card">
                <h3>Present</h3>
                <p className="text-3xl font-bold text-green-600">
                  {Object.values(attendanceData).filter(a => a.status === 'present').length}
                </p>
              </div>
              <div className="stats-card">
                <h3>Absent</h3>
                <p className="text-3xl font-bold text-red-600">
                  {Object.values(attendanceData).filter(a => a.status === 'absent').length}
                </p>
              </div>
              <div className="stats-card">
                <h3>Late</h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {Object.values(attendanceData).filter(a => a.status === 'late').length}
                </p>
              </div>
            </div>
            
            {/* Add attendance charts and detailed reports */}
          </div>
        )}

        {view === 'mark' && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit Attendance
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceTracking;