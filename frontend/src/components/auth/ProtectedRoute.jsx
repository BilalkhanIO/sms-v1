import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ children, permissions = [] }) => {
  const { user, isAuthenticated } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (permissions.length > 0 && !permissions.some(p => user.permissions.includes(p))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}; 