import { Fragment, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/outline';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markNotificationAsRead } from '../../redux/features/notificationSlice';
import { classNames } from '../../utils/helpers';

const NotificationDropdown = () => {
  const dispatch = useDispatch();
  const { items: notifications, unreadCount, loading } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleNotificationClick = async (notificationId) => {
    await dispatch(markNotificationAsRead(notificationId));
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="relative inline-flex items-center p-2 text-gray-400 hover:text-gray-500">
        <BellIcon className="h-6 w-6" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-96 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <Menu.Item key={notification.id}>
                  {({ active }) => (
                    <button
                      onClick={() => handleNotificationClick(notification.id)}
                      className={classNames(
                        active ? 'bg-gray-50' : '',
                        notification.read ? 'bg-white' : 'bg-blue-50',
                        'w-full text-left px-4 py-3 border-b border-gray-200'
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p
                            className={classNames(
                              'text-sm',
                              notification.read
                                ? 'text-gray-600'
                                : 'text-gray-900 font-medium'
                            )}
                          >
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {notification.message}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 ml-2">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                    </button>
                  )}
                </Menu.Item>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-3 text-center border-t border-gray-200">
              <button
                className="text-sm text-indigo-600 hover:text-indigo-900"
                onClick={() => {/* Implement view all notifications */}}
              >
                View All Notifications
              </button>
            </div>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default NotificationDropdown; 