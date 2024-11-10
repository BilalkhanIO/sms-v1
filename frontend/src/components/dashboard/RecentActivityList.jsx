import { ClockIcon } from '@heroicons/react/24/outline';

const RecentActivityList = () => {
  // Mock data - replace with actual data from API
  const activities = [
    {
      id: 1,
      type: 'exam',
      message: 'Final Exam results published for Class X',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      type: 'attendance',
      message: 'Attendance marked for all classes',
      timestamp: '3 hours ago',
    },
    {
      id: 3,
      type: 'fee',
      message: 'Fee collection completed for March 2024',
      timestamp: '5 hours ago',
    },
    {
      id: 4,
      type: 'event',
      message: 'Annual Sports Day scheduled for next month',
      timestamp: '1 day ago',
    },
  ];

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900">{activity.message}</p>
            <p className="text-xs text-gray-500">{activity.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivityList; 