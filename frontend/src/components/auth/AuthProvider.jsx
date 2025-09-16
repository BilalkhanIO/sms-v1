import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetCurrentUserQuery } from '../../api/authApi';
import { setCredentials, clearCredentials } from '../../store/authSlice';
import Spinner from '../common/Spinner';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { data: user, isLoading, error } = useGetCurrentUserQuery(undefined, {
    skip: false, // Always try to fetch user on app load
  });

  useEffect(() => {
    if (user) {
      dispatch(setCredentials(user));
    } else if (error && error.status === 401) {
      // User is not authenticated, clear any existing credentials
      dispatch(clearCredentials());
    }
  }, [user, error, dispatch]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return children;
};

export default AuthProvider;