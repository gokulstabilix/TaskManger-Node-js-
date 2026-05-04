import { useSelector, useDispatch } from 'react-redux';
import { signupUser, loginUser, logoutUser, clearAuthError } from '../store/authSlice';
import { resetTasks } from '../store/taskSlice';

/**
 * useAuth — A convenience hook that exposes every auth-related
 * value and action so pages/components never import Redux directly.
 *
 * 🔒 Cookie-based auth: No token is exposed. Authentication state
 *    is determined by `isAuthenticated` (set via /me API check).
 *
 * Usage:
 *   const { user, isAuthenticated, authChecked, signup, login, logout } = useAuth();
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, authChecked, status, error } = useSelector(
    (state) => state.auth
  );

  const signup = (userData) => dispatch(signupUser(userData));
  const login = (credentials) => dispatch(loginUser(credentials));
  const logout = () => {
    dispatch(logoutUser());
    dispatch(resetTasks()); // Clear stale tasks from previous user
  };
  const clearError = () => dispatch(clearAuthError());

  return {
    user,
    isAuthenticated,
    authChecked,       // true after the initial /me check completes
    isLoading: status === 'loading',
    error,
    signup,
    login,
    logout,
    clearError,
  };
};
