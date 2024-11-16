import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#6366F1'];

const AttendanceAnalytics = ({ classId, startDate, endDate }) => {
  const { reports } = useSelector((state) => state.attendance);

  const getAttendanceDistribution = () => {
    return [
      { name: 'Present', value: reports.presentCount || 0, color: COLORS[0] },
      { name: 'Absent', value: reports.absentCount || 0, color: COLORS[1] },
      { name: 'Late', value: reports.lateCount || 0, color: COLORS[2] },
      { name: 'Excused', value: reports.excusedCount || 0, color: COLORS[3] }
    ];
  };

  const getMonthlyTrend = () => {
    return reports.monthlyTrend || [];
  };

  const getDayWisePattern = () => {
    return reports.dayWisePattern || [];
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Average Attendance</h3>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">
            {reports.averageAttendance || 0}%
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Regular Students</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">
            {reports.regularStudents || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Chronic Absentees</h3>
          <p className="mt-2 text-3xl font-semibold text-red-600">
            {reports.chronicAbsentees || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Perfect Attendance</h3>
          <p className="mt-2 text-3xl font-semibold text-blue-600">
            {reports.perfectAttendance || 0}
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
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getAttendanceDistribution()}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {getAttendanceDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
            Monthly Attendance Trend
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getMonthlyTrend()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  name="Attendance Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Day-wise Pattern */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Day-wise Attendance Pattern
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getDayWisePattern()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="attendance" 
                  fill="#4F46E5" 
                  name="Attendance Rate"
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Insights */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Attendance Insights
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Most Absent Day</span>
              <span className="text-sm font-medium text-gray-900">
                {reports.mostAbsentDay || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Best Attendance Day</span>
              <span className="text-sm font-medium text-gray-900">
                {reports.bestAttendanceDay || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Average Late Arrivals</span>
              <span className="text-sm font-medium text-gray-900">
                {reports.averageLateArrivals || 0} students/day
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Attendance Trend</span>
              <span className={`text-sm font-medium ${
                reports.attendanceTrend === 'Improving' ? 'text-green-600' :
                reports.attendanceTrend === 'Declining' ? 'text-red-600' :
                'text-gray-900'
              }`}>
                {reports.attendanceTrend || 'Stable'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceAnalytics; 