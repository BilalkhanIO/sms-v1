import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'; // Import the useAuth hook
import Spinner from '../common/Spinner'; // Assuming you have a Spinner component

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth(); // Use the hook
  const location = useLocation();

  if (isLoading) {
    return <Spinner />;
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" state={{ from: location }} replace />;
};

export const PrivateRoute = ({ children, roles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
};

export const RoleRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth(); // Use the hook
  const location = useLocation();

  if (isLoading) {
    return <Spinner />;
  }

  const hasRequiredRole = isAuthenticated && allowedRoles.includes(user?.role);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRequiredRole) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => (
  <RoleRoute allowedRoles={['SUPER_ADMIN', 'SCHOOL_ADMIN']}>{children}</RoleRoute>
);

export const TeacherRoute = ({ children }) => (
  <RoleRoute allowedRoles={['TEACHER']}>{children}</RoleRoute>
);

export const StudentRoute = ({ children }) => (
  <RoleRoute allowedRoles={['STUDENT']}>{children}</RoleRoute>
);

export const ParentRoute = ({ children }) => (
  <RoleRoute allowedRoles={['PARENT']}>{children}</RoleRoute>
);