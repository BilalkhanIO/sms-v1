import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { usePermissions } from '../../hooks/usePermissions';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children, roles = [] }) => {
  const location = useLocation();
  const { hasRole } = usePermissions();
  const auth = useSelector((state) => state.auth);
  
  const isAuthenticated = auth?.isAuthenticated || false;
  const user = auth?.user || null;
  const loading = auth?.loading || false;

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.some(role => hasRole(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string)
};

export default ProtectedRoute; 