import { useContext } from 'react';
import AuthContext from '../context/authContext';
import UserContext from '../context/userContext';

export function useAuth() {
  const { login, logout, register } = useContext(AuthContext);
  const { user, error, isAuthenticated, isLoading } = useContext(UserContext);
  return {
    login,
    logout,
    register,
    user,
    error,
    isAuthenticated,
    isLoading
  };
}
