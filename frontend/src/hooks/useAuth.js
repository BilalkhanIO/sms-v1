import { useSelector } from "react-redux";
import { selectCurrentUser, selectIsLoading } from "../store/authSlice"; // Adjust path to your authSlice

const useAuth = () => {
  const user = useSelector(selectCurrentUser);
  const isLoading = useSelector(selectIsLoading);
  const isAuthenticated = !!user; // Or useSelector(selectIsAuthenticated) if you have that selector in authSlice

  return { user, isAuthenticated, isLoading };
};

export default useAuth;
