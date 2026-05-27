import React from 'react';

const VARIANTS = {
  // Generic
  active:    'bg-green-100 text-green-800',
  inactive:  'bg-gray-100 text-gray-700',
  pending:   'bg-yellow-100 text-yellow-800',
  // Exam statuses
  SCHEDULED: 'bg-blue-100 text-blue-800',
  ONGOING:   'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  // Fee statuses
  PAID:      'bg-green-100 text-green-800',
  PENDING:   'bg-yellow-100 text-yellow-800',
  OVERDUE:   'bg-red-100 text-red-800',
  PARTIAL:   'bg-orange-100 text-orange-800',
  WAIVED:    'bg-purple-100 text-purple-800',
  // Attendance statuses
  PRESENT:   'bg-green-100 text-green-800',
  ABSENT:    'bg-red-100 text-red-800',
  LATE:      'bg-yellow-100 text-yellow-800',
  EXCUSED:   'bg-blue-100 text-blue-800',
  // Roles
  SUPER_ADMIN:   'bg-purple-100 text-purple-800',
  SCHOOL_ADMIN:  'bg-blue-100 text-blue-800',
  TEACHER:       'bg-green-100 text-green-800',
  STUDENT:       'bg-yellow-100 text-yellow-800',
  PARENT:        'bg-orange-100 text-orange-800',
};

const StatusBadge = ({ status, label, className = '' }) => {
  const display = label ?? status ?? '';
  const colorClass = VARIANTS[status] || 'bg-gray-100 text-gray-700';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}>
      {display}
    </span>
  );
};

export default StatusBadge;
