import { useSelector } from 'react-redux';
import { PERMISSIONS } from '../constants/authConstants';

export const usePermissions = () => {
  const { user } = useSelector((state) => state.auth);

  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    
    const userPermissions = PERMISSIONS[user.role];
    return userPermissions?.includes('*') || userPermissions?.includes(permission);
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  return { hasPermission, hasRole };
}; 