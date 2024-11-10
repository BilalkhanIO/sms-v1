import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentAttendanceReport, fetchClassAttendanceReport } from '../../redux/features/attendanceSlice';
import { fetchClasses } from '../../redux/features/academicSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AttendanceReportPage = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const dispatch = useDispatch();
  const { classes, loading: classesLoading } = useSelector((state) => state.academic);
  const { studentReport, classReport, loading: reportLoading } = useSelector((state) => state.attendance);
  const { students } = useSelector((state) => state.student);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  useEffect(() => {
    if (selectedStudent && dateRange.startDate && dateRange.endDate) {
      dispatch(fetchStudentAttendanceReport({
        studentId: selectedStudent,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      }));
    }
  }, [dispatch, selectedStudent, dateRange]);

  useEffect(() => {
    if (selectedClass && dateRange.startDate && dateRange.endDate) {
      dispatch(fetchClassAttendanceReport({
        classId: selectedClass,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      }));
    }
  }, [dispatch, selectedClass, dateRange]);

  if (classesLoading || reportLoading) {
    return <LoadingSpinner />;
  }

  const classStudents = students.filter(student => student.class === selectedClass);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Attendance Reports
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              View and analyze attendance data
            </p>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            {/* Filters */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Select Class</option>
                  {classes.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.name} - {classItem.section}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">All Students</option>
                  {classStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
              </div>
            </div>

            {/* Charts and Statistics */}
            <div className="mt-8">
              {selectedStudent ? (
                <div className="space-y-8">
                  {/* Student Attendance Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-green-100 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-green-800">Present</h4>
                      <p className="mt-2 text-3xl font-bold text-green-900">
                        {studentReport?.presentCount || 0}
                      </p>
                    </div>
                    <div className="bg-red-100 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-red-800">Absent</h4>
                      <p className="mt-2 text-3xl font-bold text-red-900">
                        {studentReport?.absentCount || 0}
                      </p>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-yellow-800">Late</h4>
                      <p className="mt-2 text-3xl font-bold text-yellow-900">
                        {studentReport?.lateCount || 0}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-800">Attendance Rate</h4>
                      <p className="mt-2 text-3xl font-bold text-blue-900">
                        {studentReport?.attendanceRate?.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Student Attendance Trend */}
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Attendance Trend</h4>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={studentReport?.dailyAttendance || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="status" fill="#4F46E5" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Class Attendance Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-indigo-100 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-indigo-800">Average Attendance Rate</h4>
                      <p className="mt-2 text-3xl font-bold text-indigo-900">
                        {classReport?.averageAttendanceRate?.toFixed(1)}%
                      </p>
                    </div>
                    <div className="bg-purple-100 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-purple-800">Total Students</h4>
                      <p className="mt-2 text-3xl font-bold text-purple-900">
                        {classReport?.totalStudents || 0}
                      </p>
                    </div>
                    <div className="bg-pink-100 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-pink-800">Days Tracked</h4>
                      <p className="mt-2 text-3xl font-bold text-pink-900">
                        {classReport?.daysTracked || 0}
                      </p>
                    </div>
                  </div>

                  {/* Class Attendance Chart */}
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Class Attendance Overview</h4>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={classReport?.attendanceDistribution || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="present" stackId="a" fill="#10B981" />
                          <Bar dataKey="absent" stackId="a" fill="#EF4444" />
                          <Bar dataKey="late" stackId="a" fill="#F59E0B" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReportPage; 