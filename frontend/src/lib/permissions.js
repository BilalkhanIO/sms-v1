// Central role & permissions definition.
// Every access-control decision in the UI reads from here.

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  MULTI_SCHOOL_ADMIN: 'MULTI_SCHOOL_ADMIN',
  SCHOOL_ADMIN: 'SCHOOL_ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
};

export const PERMISSIONS = {
  users: {
    view:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    create: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    edit:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    delete: [ROLES.SUPER_ADMIN],
  },
  schools: {
    view:   [ROLES.SUPER_ADMIN],
    create: [ROLES.SUPER_ADMIN],
    edit:   [ROLES.SUPER_ADMIN],
    delete: [ROLES.SUPER_ADMIN],
  },
  teachers: {
    view:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    create: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    edit:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    delete: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  },
  students: {
    view:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.PARENT],
    create: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    edit:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    delete: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  },
  classes: {
    view:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT],
    create: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    edit:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    delete: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  },
  subjects: {
    view:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT],
    create: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    edit:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    delete: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  },
  exams: {
    view:    [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT],
    create:  [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    edit:    [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    delete:  [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    results: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
  },
  fees: {
    view:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PARENT, ROLES.STUDENT],
    create: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    edit:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    delete: [ROLES.SUPER_ADMIN],
    pay:    [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  },
  attendance: {
    view:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
    create: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    edit:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    delete: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  },
  calendar: {
    view:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
    create: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    edit:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    delete: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  },
  timetable: {
    view:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
    create: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    edit:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    delete: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  },
  assignments: {
    view:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT],
    create: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    edit:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    delete: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    submit: [ROLES.STUDENT],
    grade:  [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
  },
  library: {
    view:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT],
    create: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    edit:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    delete: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    issue:  [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    return: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  },
  transport: {
    view:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
    create: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    edit:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    delete: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    assign: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  },
  leave: {
    view:    [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT],
    create:  [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT],
    approve: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    delete:  [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  },
  messages: {
    view:         Object.values(ROLES),
    send:         Object.values(ROLES),
    announce:     [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  },
  notifications: {
    view:  Object.values(ROLES),
    send:  [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  },
  academicYears: {
    view:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT],
    create: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    edit:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    delete: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  },
  reports: {
    view: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  },
  settings: {
    view: [ROLES.SUPER_ADMIN],
    edit: [ROLES.SUPER_ADMIN],
  },
};

export function can(user, resource, action = 'view') {
  if (!user) return false;
  const allowed = PERMISSIONS[resource]?.[action];
  if (!allowed) return false;
  return allowed.includes(user.role);
}

// Sidebar nav — grouped by category for visual separation
export const NAV_CONFIG = [
  // Core
  { to: '/dashboard',               label: 'Dashboard',      icon: 'LayoutDashboard', roles: Object.values(ROLES), group: 'core' },

  // Administration
  { to: '/dashboard/schools',       label: 'Schools',        icon: 'Building2',       roles: [ROLES.SUPER_ADMIN, ROLES.MULTI_SCHOOL_ADMIN], group: 'admin' },
  { to: '/dashboard/users',         label: 'Users',          icon: 'Users',           roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN], group: 'admin' },
  { to: '/dashboard/academic-years', label: 'Academic Years', icon: 'CalendarRange',  roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN], group: 'admin' },

  // People
  { to: '/dashboard/teachers',      label: 'Teachers',       icon: 'GraduationCap',   roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER], group: 'people' },
  { to: '/dashboard/students',      label: 'Students',       icon: 'BookUser',        roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.PARENT], group: 'people' },

  // Academics
  { to: '/dashboard/classes',       label: 'Classes',        icon: 'School',          roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT], group: 'academics' },
  { to: '/dashboard/subjects',      label: 'Subjects',       icon: 'BookOpen',        roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT], group: 'academics' },
  { to: '/dashboard/timetable',     label: 'Timetable',      icon: 'Clock',           roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT], group: 'academics' },
  { to: '/dashboard/assignments',   label: 'Assignments',    icon: 'FileText',        roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT], group: 'academics' },
  { to: '/dashboard/exams',         label: 'Exams',          icon: 'ClipboardList',   roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT], group: 'academics' },
  { to: '/dashboard/attendance',    label: 'Attendance',     icon: 'CalendarCheck',   roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT], group: 'academics' },

  // Finance & Services
  { to: '/dashboard/fees',          label: 'Fees',           icon: 'CreditCard',      roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.STUDENT, ROLES.PARENT], group: 'services' },
  { to: '/dashboard/library',       label: 'Library',        icon: 'Library',         roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT], group: 'services' },
  { to: '/dashboard/transport',     label: 'Transport',      icon: 'Bus',             roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.STUDENT, ROLES.PARENT], group: 'services' },

  // Communication
  { to: '/dashboard/messages',      label: 'Messages',       icon: 'MessageSquare',   roles: Object.values(ROLES), group: 'comms' },
  { to: '/dashboard/calendar',      label: 'Calendar',       icon: 'CalendarDays',    roles: Object.values(ROLES), group: 'comms' },
  { to: '/dashboard/leave',         label: 'Leave',          icon: 'Umbrella',        roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT], group: 'comms' },

  // System
  { to: '/dashboard/activity-logs', label: 'Activity',       icon: 'Activity',        roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN], group: 'system' },
  { to: '/dashboard/admin/reports', label: 'Reports',        icon: 'BarChart2',       roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN], group: 'system' },
  { to: '/dashboard/admin/audit-logs', label: 'Audit Logs',  icon: 'ShieldCheck',     roles: [ROLES.SUPER_ADMIN], group: 'system' },
  { to: '/dashboard/admin/backup-management', label: 'Backups', icon: 'HardDrive',    roles: [ROLES.SUPER_ADMIN], group: 'system' },
  { to: '/dashboard/settings',      label: 'Settings',       icon: 'Settings',        roles: [ROLES.SUPER_ADMIN], group: 'system' },
];

export const NAV_GROUPS = {
  core:     '',
  admin:    'Administration',
  people:   'People',
  academics: 'Academics',
  services: 'Services',
  comms:    'Communication',
  system:   'System',
};
