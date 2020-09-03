import { createContext } from 'react';

export interface IUserContext {
  user: string | null | undefined;
  error: Error | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export default createContext<IUserContext>({
  user: null,
  error: null,
  isLoading: false,
  isAuthenticated: false,
});
