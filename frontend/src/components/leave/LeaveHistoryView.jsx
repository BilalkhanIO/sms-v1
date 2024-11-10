import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
} from '@heroicons/react/outline';

const LeaveHistoryView = ({ userId }) => {
  const [groupedHistory, setGroupedHistory] = useState({});
  const { requests } = useSelector((state) => state.leave);

  useEffect(() => {
    // Group leave requests by month/year
    const grouped = requests
      .filter(request => request.userId === userId)
      .reduce((acc, request) => {
        const date = new Date(request.startDate);
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(request);
        return acc;
      }, {});
    setGroupedHistory(grouped);
  }, [requests, userId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedHistory)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([monthYear, leaves]) => (
          <div key={monthYear} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {new Date(monthYear).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </h3>
            <div className="space-y-4">
              {leaves.map((leave) => (
                <div
                  key={leave.id}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {leave.type} Leave
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatDate(leave.startDate)} -{' '}
                          {formatDate(leave.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {calculateDuration(leave.startDate, leave.endDate)}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        leave.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : leave.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {leave.status}
                    </span>
                  </div>
                  {leave.remarks && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">{leave.remarks}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      {Object.keys(groupedHistory).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No leave history found
        </div>
      )}
    </div>
  );
};

export default LeaveHistoryView; 