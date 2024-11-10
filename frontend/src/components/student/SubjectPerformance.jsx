import { useState } from 'react';
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

const SubjectPerformance = ({ subject }) => {
  const [selectedMetric, setSelectedMetric] = useState('marks'); // marks, assignments, attendance

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeColor = (grade) => {
    const gradeColors = {
      'A+': 'text-green-600',
      'A': 'text-green-500',
      'B+': 'text-blue-600',
      'B': 'text-blue-500',
      'C+': 'text-yellow-600',
      'C': 'text-yellow-500',
      'D': 'text-red-500',
      'F': 'text-red-600',
    };
    return gradeColors[grade] || 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        {/* Subject Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="text-lg font-medium text-gray-900">
              {subject.name}
            </h4>
            <p className="text-sm text-gray-500">
              {subject.teacher}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${getGradeColor(subject.grade)}`}>
              {subject.grade}
            </p>
            <p className={`text-sm font-medium ${getPerformanceColor(subject.percentage)}`}>
              {subject.percentage}%
            </p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">Tests</p>
            <p className="text-lg font-medium text-gray-900">
              {subject.testAverage}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Assignments</p>
            <p className="text-lg font-medium text-gray-900">
              {subject.assignmentCompletion}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Attendance</p>
            <p className="text-lg font-medium text-gray-900">
              {subject.attendanceRate}%
            </p>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="marks">Test Marks</option>
              <option value="assignments">Assignments</option>
              <option value="attendance">Attendance</option>
            </select>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subject[selectedMetric]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="value"
                  fill="#4F46E5"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        {subject.recentActivities?.length > 0 && (
          <div className="mt-6">
            <h5 className="text-sm font-medium text-gray-900 mb-3">
              Recent Activities
            </h5>
            <div className="space-y-2">
              {subject.recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-500">{activity.name}</span>
                  <span className={`font-medium ${getPerformanceColor(activity.score)}`}>
                    {activity.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Details
          </button>
          <button
            type="button"
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectPerformance; 