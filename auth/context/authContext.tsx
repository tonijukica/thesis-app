import { createContext } from 'react';


export interface IAuthContext {
  data?: any;
  login: (username: string) => Promise<void>;
  logout: () => void;
  register: (username: string) => Promise<void>;
}
const AuthContext = createContext<IAuthContext>({
  data: {
    user: undefined
  },
  login: (): Promise<void> => {
    throw new Error('Err1');
  },
  logout: () => {
    throw new Error('Err2');
  },
  register: (): Promise<void> => {
    throw new Error('Err3');
  },
});
export default AuthContext;
