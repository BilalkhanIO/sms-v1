import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/zustand/useAuthStore';
import Spinner from '../components/common/Spinner';

export const PublicRoute = ({ children }) => {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const location = useLocation();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  return !user ? children : <Navigate to="/dashboard" state={{ from: location }} replace />;
};

export const PrivateRoute = ({ children, roles = [] }) => {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const location = useLocation();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};
