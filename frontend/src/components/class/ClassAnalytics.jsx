import { useEffect, useState } from 'react';
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ClassAnalytics = ({ classId }) => {
  const { selectedClass } = useSelector((state) => state.class);
  const [analyticsData, setAnalyticsData] = useState({
    attendanceStats: [],
    performanceStats: [],
    subjectWisePerformance: [],
    studentDistribution: []
  });

  useEffect(() => {
    // Fetch analytics data
    const fetchAnalytics = async () => {
      try {
        // Implement API calls to fetch analytics data
        // For now using dummy data
        setAnalyticsData({
          attendanceStats: [
            { month: 'Jan', attendance: 95 },
            { month: 'Feb', attendance: 92 },
            { month: 'Mar', attendance: 88 },
            // Add more months...
          ],
          performanceStats: [
            { subject: 'Math', average: 85 },
            { subject: 'Science', average: 78 },
            { subject: 'English', average: 82 },
            // Add more subjects...
          ],
          subjectWisePerformance: [
            { name: 'A+', value: 30 },
            { name: 'A', value: 25 },
            { name: 'B', value: 20 },
            { name: 'C', value: 15 },
          ],
          studentDistribution: [
            { range: '90-100', count: 15 },
            { range: '80-89', count: 25 },
            { range: '70-79', count: 20 },
            { range: '60-69', count: 10 },
          ]
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };

    fetchAnalytics();
  }, [classId]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Average Attendance</h3>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">
            {selectedClass?.averageAttendance || 0}%
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Class Average</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">
            {selectedClass?.classAverage || 0}%
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pass Rate</h3>
          <p className="mt-2 text-3xl font-semibold text-blue-600">
            {selectedClass?.passRate || 0}%
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Top Performers</h3>
          <p className="mt-2 text-3xl font-semibold text-purple-600">
            {selectedClass?.topPerformers || 0}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Attendance Trend
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.attendanceStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Subject Performance
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.performanceStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Grade Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.subjectWisePerformance}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analyticsData.subjectWisePerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Score Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Score Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.studentDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassAnalytics;
