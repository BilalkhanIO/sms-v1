import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from '../../api/notificationApi';

const TYPE_COLORS = {
  INFO:         'border-blue-400 bg-blue-50',
  WARNING:      'border-yellow-400 bg-yellow-50',
  ALERT:        'border-red-400 bg-red-50',
  ANNOUNCEMENT: 'border-purple-400 bg-purple-50',
};

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const { data: countData } = useGetUnreadCountQuery(undefined, { pollingInterval: 30000 });
  const { data: notifData } = useGetNotificationsQuery(undefined, { skip: !open });
  const [markAll] = useMarkAllAsReadMutation();
  const [markOne] = useMarkAsReadMutation();

  const count = countData?.count ?? countData?.data?.count ?? 0;
  const notifications = notifData?.data || notifData || [];

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkAll = async () => {
    try { await markAll().unwrap(); } catch {}
  };

  const handleClickNotif = async (n) => {
    if (!n.read) {
      try { await markOne(n._id).unwrap(); } catch {}
    }
    if (n.link) window.location.href = n.link;
  };

  const timeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return '';
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            {count > 0 && (
              <button
                onClick={handleMarkAll}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Bell className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              notifications.slice(0, 10).map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleClickNotif(n)}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${
                    TYPE_COLORS[n.type] || 'border-gray-200 bg-white'
                  } ${!n.read ? 'bg-blue-50/30' : ''}`}
                >
                  <p className={`text-sm ${n.read ? 'text-gray-600' : 'font-medium text-gray-900'}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                </div>
              ))
            )}
          </div>

          {notifications.length > 10 && (
            <div className="px-4 py-2 border-t border-gray-100 text-center">
              <span className="text-xs text-gray-400">{notifications.length - 10} more notifications</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
