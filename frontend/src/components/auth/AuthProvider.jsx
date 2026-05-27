import { useEffect } from 'react';
import { useGetCurrentUserQuery } from '../../api/authApi';
import { useAuthStore } from '../../store/zustand/useAuthStore';
import Spinner from '../common/Spinner';

const AuthProvider = ({ children }) => {
  const { setUser, clearUser } = useAuthStore();

  const { data, isLoading, error } = useGetCurrentUserQuery();

  useEffect(() => {
    if (data) {
      setUser(data.data ?? data);
    } else if (error) {
      clearUser();
    }
  }, [data, error, setUser, clearUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner />
          <p className="mt-3 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthProvider;
