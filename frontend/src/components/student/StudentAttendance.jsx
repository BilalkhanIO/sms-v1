import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendanceStats } from '../../redux/features/studentSlice';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StudentAttendance = ({ studentId }) => {
  const [timeframe, setTimeframe] = useState('month'); // week, month, year
  const { attendanceStats, loading } = useSelector((state) => state.student);
  const dispatch = useDispatch();

  useEffect(() => {
    if (studentId) {
      dispatch(fetchAttendanceStats({ studentId, timeframe }));
    }
  }, [dispatch, studentId, timeframe]);

  const getAttendanceDistribution = () => {
    return [
      { name: 'Present', value: attendanceStats?.presentCount || 0 },
      { name: 'Absent', value: attendanceStats?.absentCount || 0 },
      { name: 'Late', value: attendanceStats?.lateCount || 0 },
    ];
  };

  return (
    <div className="space-y-6">
      {/* Timeframe Selection */}
      <div className="flex justify-end">
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Attendance Rate</h3>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">
            {attendanceStats?.attendanceRate || 0}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Present Days</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">
            {attendanceStats?.presentCount || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Absent Days</h3>
          <p className="mt-2 text-3xl font-semibold text-red-600">
            {attendanceStats?.absentCount || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Late Arrivals</h3>
          <p className="mt-2 text-3xl font-semibold text-yellow-600">
            {attendanceStats?.lateCount || 0}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendance Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Attendance Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getAttendanceDistribution()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {getAttendanceDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Attendance Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceStats?.monthlyTrend || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#0088FE" name="Present" />
                <Bar dataKey="absent" fill="#FF8042" name="Absent" />
                <Bar dataKey="late" fill="#FFBB28" name="Late" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Attendance Details Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Attendance Details
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceStats?.details?.map((record) => (
                  <tr key={record.date}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          record.status === 'PRESENT'
                            ? 'bg-green-100 text-green-800'
                            : record.status === 'ABSENT'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.timeIn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.timeOut}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
