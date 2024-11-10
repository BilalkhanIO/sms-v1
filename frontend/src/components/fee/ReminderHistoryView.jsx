import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  MailIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/outline';

const ReminderHistoryView = ({ studentId = null }) => {
  const [groupedHistory, setGroupedHistory] = useState({});
  const { reminderHistory } = useSelector((state) => state.fee);

  useEffect(() => {
    // Group reminders by date
    const history = studentId
      ? reminderHistory.filter((item) => item.studentId === studentId)
      : reminderHistory;

    const grouped = history.reduce((acc, reminder) => {
      const date = new Date(reminder.sentAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(reminder);
      return acc;
    }, {});

    setGroupedHistory(grouped);
  }, [reminderHistory, studentId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'FAILED':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'EMAIL':
        return <MailIcon className="h-5 w-5 text-gray-400" />;
      case 'SMS':
        return <PhoneIcon className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedHistory)
        .sort(([a], [b]) => new Date(b) - new Date(a))
        .map(([date, reminders]) => (
          <div key={date} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h3>
            <div className="space-y-4">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(reminder.type)}
                        <span className="text-sm font-medium text-gray-900">
                          {reminder.template.name}
                        </span>
                      </div>
                      {!studentId && (
                        <div className="text-sm text-gray-500">
                          To: {reminder.studentName}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        Amount Due: ${reminder.dueAmount}
                      </div>
                      <div className="text-sm text-gray-500">
                        Sent at: {formatTime(reminder.sentAt)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(reminder.status)}
                      <span
                        className={`text-xs font-medium ${
                          reminder.status === 'DELIVERED'
                            ? 'text-green-800'
                            : reminder.status === 'FAILED'
                            ? 'text-red-800'
                            : 'text-yellow-800'
                        }`}
                      >
                        {reminder.status}
                      </span>
                    </div>
                  </div>
                  {reminder.error && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-red-600">{reminder.error}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      {Object.keys(groupedHistory).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No reminder history found
        </div>
      )}
    </div>
  );
};

export default ReminderHistoryView; 