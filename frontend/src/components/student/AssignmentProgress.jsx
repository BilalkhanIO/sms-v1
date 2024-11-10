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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const AssignmentProgress = ({ assignments }) => {
  const [selectedStatus, setSelectedStatus] = useState('all'); // all, pending, completed, overdue

  const getStatusColor = (status) => {
    const colors = {
      completed: 'text-green-600',
      pending: 'text-yellow-600',
      overdue: 'text-red-600',
    };
    return colors[status] || 'text-gray-600';
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredAssignments = assignments.filter(
    (assignment) => selectedStatus === 'all' || assignment.status === selectedStatus
  );

  // Calculate statistics
  const stats = assignments.reduce(
    (acc, curr) => {
      acc[curr.status]++;
      acc.total++;
      return acc;
    },
    { completed: 0, pending: 0, overdue: 0, total: 0 }
  );

  const pieData = [
    { name: 'Completed', value: stats.completed, color: '#10B981' },
    { name: 'Pending', value: stats.pending, color: '#F59E0B' },
    { name: 'Overdue', value: stats.overdue, color: '#EF4444' },
  ];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Overdue</p>
            <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
          </div>
        </div>

        {/* Status Distribution Chart */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assignments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Assignment List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-900">Assignments</h4>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h5 className="text-sm font-medium text-gray-900">
                    {assignment.title}
                  </h5>
                  <p className="text-sm text-gray-500">{assignment.subject}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                      assignment.status
                    )}`}
                  >
                    {assignment.status}
                  </span>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  {assignment.score && (
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Score</p>
                      <p className={`text-sm font-medium ${getStatusColor(assignment.status)}`}>
                        {assignment.score}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentProgress; 