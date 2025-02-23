import { useSelector } from "react-redux";
import { selectCurrentUser, selectIsLoading, selectIsAuthenticated } from "../store/authSlice"; 

const useAuth = () => {
  const user = useSelector(selectCurrentUser);
  const isLoading = useSelector(selectIsLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return { user, isAuthenticated, isLoading };
};

export default useAuth;
