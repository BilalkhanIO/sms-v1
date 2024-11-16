export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday'
];

export const DEFAULT_TIME_SLOTS = [
  { id: '1', startTime: '08:00', endTime: '09:00' },
  { id: '2', startTime: '09:00', endTime: '10:00' },
  { id: '3', startTime: '10:00', endTime: '11:00' },
  { id: 'break1', startTime: '11:00', endTime: '11:30', isBreak: true, breakName: 'Morning Break' },
  { id: '4', startTime: '11:30', endTime: '12:30' },
  { id: '5', startTime: '12:30', endTime: '13:30' },
  { id: 'break2', startTime: '13:30', endTime: '14:00', isBreak: true, breakName: 'Lunch Break' },
  { id: '6', startTime: '14:00', endTime: '15:00' },
  { id: '7', startTime: '15:00', endTime: '16:00' }
];

export const SCHEDULE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

export const PERIOD_COLORS = {
  DEFAULT: 'bg-indigo-100 text-indigo-800',
  BREAK: 'bg-gray-100 text-gray-800',
  CONFLICT: 'bg-red-100 text-red-800'
};

export const SCHEDULE_VIEWS = {
  WEEKLY: 'weekly',
  DAILY: 'daily',
  LIST: 'list'
};
