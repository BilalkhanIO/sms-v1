export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SCHOOL_ADMIN: 'SCHOOL_ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT'
};

export const PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: ['*'],
  [ROLES.SCHOOL_ADMIN]: [
    'manage_users',
    'manage_teachers',
    'manage_students',
    'manage_classes',
    'manage_subjects',
    'manage_exams',
    'view_reports'
  ],
  [ROLES.TEACHER]: [
    'manage_attendance',
    'manage_grades',
    'view_students',
    'view_classes',
    'view_subjects'
  ],
  [ROLES.STUDENT]: [
    'view_grades',
    'view_attendance',
    'view_schedule',
    'view_assignments'
  ],
  [ROLES.PARENT]: [
    'view_grades',
    'view_attendance',
    'view_schedule',
    'view_fees'
  ]
}; 