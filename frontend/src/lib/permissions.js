// Central role & permissions definition.
// Every access-control decision in the UI reads from here.

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SCHOOL_ADMIN: 'SCHOOL_ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
};

// Which roles can access which feature areas
export const PERMISSIONS = {
  // User management
  users: {
    view:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    create: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    edit:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    delete: [ROLES.SUPER_ADMIN],
  },
  // Schools
  schools: {
    view:   [ROLES.SUPER_ADMIN],
    create: [ROLES.SUPER_ADMIN],
    edit:   [ROLES.SUPER_ADMIN],
    delete: [ROLES.SUPER_ADMIN],
  },
  // Teachers
  teachers: {
    view:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    create: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    edit:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    delete: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  },
  // Students
  students: {
    view:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.PARENT],
    create: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    edit:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    delete: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  },
  // Classes
  classes: {
    view:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT],
    create: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    edit:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    delete: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  },
  // Subjects
  subjects: {
    view:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT],
    create: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    edit:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    delete: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  },
  // Exams
  exams: {
    view:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT],
    create: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    edit:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    delete: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    results: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
  },
  // Fees
  fees: {
    view:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PARENT, ROLES.STUDENT],
    create: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    edit:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    delete: [ROLES.SUPER_ADMIN],
    pay:    [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  },
  // Attendance
  attendance: {
    view:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
    create: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    edit:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    delete: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  },
  // Calendar
  calendar: {
    view:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
    create: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    edit:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    delete: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  },
  // Reports / Audit
  reports: {
    view:   [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  },
  // System settings
  settings: {
    view:   [ROLES.SUPER_ADMIN],
    edit:   [ROLES.SUPER_ADMIN],
  },
};

// Hook-compatible helper (call with the Zustand user object)
export function can(user, resource, action = 'view') {
  if (!user) return false;
  const allowed = PERMISSIONS[resource]?.[action];
  if (!allowed) return false;
  return allowed.includes(user.role);
}

// Sidebar nav config — each entry lists which roles see it
export const NAV_CONFIG = [
  { to: '/dashboard',                    label: 'Dashboard',    icon: 'LayoutDashboard', roles: Object.values(ROLES) },
  { to: '/dashboard/schools',            label: 'Schools',      icon: 'Building2',       roles: [ROLES.SUPER_ADMIN] },
  { to: '/dashboard/users',              label: 'Users',        icon: 'Users',           roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN] },
  { to: '/dashboard/teachers',           label: 'Teachers',     icon: 'GraduationCap',   roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER] },
  { to: '/dashboard/students',           label: 'Students',     icon: 'BookUser',        roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.PARENT] },
  { to: '/dashboard/classes',            label: 'Classes',      icon: 'School',          roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT] },
  { to: '/dashboard/subjects',           label: 'Subjects',     icon: 'BookOpen',        roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT] },
  { to: '/dashboard/exams',              label: 'Exams',        icon: 'ClipboardList',   roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT] },
  { to: '/dashboard/attendance',         label: 'Attendance',   icon: 'CalendarCheck',   roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT] },
  { to: '/dashboard/fees',               label: 'Fees',         icon: 'CreditCard',      roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.STUDENT, ROLES.PARENT] },
  { to: '/dashboard/calendar',           label: 'Calendar',     icon: 'CalendarDays',    roles: Object.values(ROLES) },
  { to: '/dashboard/activity-logs',      label: 'Activity',     icon: 'Activity',        roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN] },
  { to: '/dashboard/admin/reports',      label: 'Reports',      icon: 'BarChart2',       roles: [ROLES.SUPER_ADMIN] },
  { to: '/dashboard/admin/audit-logs',   label: 'Audit Logs',   icon: 'ShieldCheck',     roles: [ROLES.SUPER_ADMIN] },
  { to: '/dashboard/admin/backup-management', label: 'Backups', icon: 'HardDrive',       roles: [ROLES.SUPER_ADMIN] },
  { to: '/dashboard/settings',           label: 'Settings',     icon: 'Settings',        roles: [ROLES.SUPER_ADMIN] },
];
