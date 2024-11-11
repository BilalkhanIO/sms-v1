const ROLE_PERMISSIONS = {
  SUPER_ADMIN: ['*'],
  SCHOOL_ADMIN: ['MANAGE_USERS', 'VIEW_REPORTS'],
  TEACHER: ['VIEW_STUDENTS', 'MANAGE_GRADES'],
  STUDENT: ['VIEW_GRADES', 'VIEW_SCHEDULE'],
  PARENT: ['VIEW_CHILDREN', 'VIEW_REPORTS']
};

exports.hasPermission = (requiredPermission) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const permissions = ROLE_PERMISSIONS[userRole];

    if (permissions.includes('*') || permissions.includes(requiredPermission)) {
      next();
    } else {
      res.status(403).json({ message: 'Permission denied' });
    }
  };
}; 