import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import dashboardService from '@/services/dashboardService';
import { ClockIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const { loading, error, execute } = useApi(dashboardService.getRecentActivities);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await execute();
        setActivities(data?.data || []);
      } catch (error) {
        console.error('Failed to load activities:', error);
      }
    };

    loadActivities();
  }, [execute]);

  if (loading) return <LoadingSpinner size="small" />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h2>
      <div className="space-y-4">
        {Array.isArray(activities) && activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
              </div>
              {activity.details && (
                <p className="mt-1 text-sm text-gray-500">{activity.details}</p>
              )}
            </div>
          </div>
        ))}
        {(!activities || activities.length === 0) && (
          <p className="text-center text-gray-500">No recent activities</p>
        )}
      </div>
    </div>
  );
};

export default RecentActivities;