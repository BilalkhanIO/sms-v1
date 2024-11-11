import { useSelector } from 'react-redux';
import { ClockIcon } from '@heroicons/react/24/outline';

const RecentActivities = () => {
  const activities = useSelector((state) => state.dashboard.recentActivities);

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
      {activities.length === 0 && (
        <p className="text-center text-gray-500">No recent activities</p>
      )}
    </div>
  );
};

export default RecentActivities; 