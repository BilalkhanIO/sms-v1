import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetCurrentUserQuery } from '../../api/authApi';
import { setCredentials, clearCredentials } from '../../store/authSlice';
import Spinner from '../common/Spinner';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { data: user, isLoading, isError, error } = useGetCurrentUserQuery();

  useEffect(() => {
    if (user) {
      dispatch(setCredentials({ user, isAuthenticated: true }));
    } else if (isError && error.status === 401) {
      dispatch(clearCredentials());
    }
  }, [user, isError, error, dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return children;
};

export default AuthProvider;