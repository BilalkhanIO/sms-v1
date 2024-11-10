import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../../redux/features/notificationSlice';
import {
  CheckCircleIcon,
  ExclamationIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline';

const NotificationListPage = () => {
  const [filters, setFilters] = useState({
    type: '',
    read: '',
  });

  const dispatch = useDispatch();
  const { items: notifications, loading } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <CheckCircleIcon className="h-6 w-6 text-green-500" aria-hidden="true" />
        );
      case 'warning':
        return (
          <ExclamationIcon className="h-6 w-6 text-yellow-500" aria-hidden="true" />
        );
      default:
        return (
          <InformationCircleIcon
            className="h-6 w-6 text-blue-500"
            aria-hidden="true"
          />
        );
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
        <div className="flex space-x-4">
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Types</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
          <select
            value={filters.read}
            onChange={(e) => setFilters({ ...filters, read: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <ul className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`p-4 hover:bg-gray-50 ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      notification.read ? 'text-gray-600' : 'text-gray-900'
                    }`}
                  >
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationListPage; 