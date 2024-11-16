const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SCHOOL_ADMIN: 'SCHOOL_ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
};

const PERMISSIONS = {
  // User Management
  MANAGE_USERS: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  MANAGE_ROLES: [ROLES.SUPER_ADMIN],
  VIEW_USERS: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],

  // Student Management
  MANAGE_STUDENTS: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  VIEW_STUDENTS: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
  VIEW_OWN_PROFILE: [ROLES.STUDENT],

  // Teacher Management
  MANAGE_TEACHERS: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  VIEW_TEACHERS: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PARENT],

  // Academic Management
  MANAGE_CLASSES: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  MANAGE_SUBJECTS: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  VIEW_CLASSES: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT],

  // Attendance Management
  MANAGE_ATTENDANCE: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
  VIEW_ATTENDANCE: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.PARENT],

  // Fee Management
  MANAGE_FEES: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  VIEW_FEES: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PARENT],
};

const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  return PERMISSIONS[permission]?.includes(userRole) || false;
};

module.exports = {
  ROLES,
  PERMISSIONS,
  hasPermission
}; 