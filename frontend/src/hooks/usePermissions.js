import { useSelector } from 'react-redux';
import { ROLE_PERMISSIONS, ROLES } from '../utils/constants';

export const usePermissions = () => {
  const { user } = useSelector((state) => state.auth);

  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role];
    return userPermissions?.includes(permission) || userPermissions?.includes('*');
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const isAdmin = () => {
    return user?.role === ROLES.SUPER_ADMIN || user?.role === ROLES.SCHOOL_ADMIN;
  };

  const isTeacher = () => {
    return user?.role === ROLES.TEACHER;
  };

  const isStudent = () => {
    return user?.role === ROLES.STUDENT;
  };

  return {
    hasPermission,
    hasRole,
    isAdmin,
    isTeacher,
    isStudent,
  };
}; 