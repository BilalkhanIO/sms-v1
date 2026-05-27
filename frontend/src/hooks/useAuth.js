import { useAuthStore } from '../store/zustand/useAuthStore';
import { can } from '../lib/permissions';

const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    can: (resource, action) => can(user, resource, action),
  };
};

export default useAuth;
