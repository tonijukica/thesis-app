import { useState, useEffect } from 'react';

import UserContext, { IUserContext } from './userContext';


export interface UserProviderOptions {
  children: JSX.Element
}

function initialState(): IUserContext {
  return{
    user: undefined,
    error: null,
    isLoading: true,
    isAuthenticated: false
  }
}

export default function UserProvider({ children }: UserProviderOptions): JSX.Element {
  const [state, setState] = useState(initialState());
  useEffect(() => {
    const sessionStorage = window.sessionStorage.getItem('user');
    if(sessionStorage){
      const { user, isAuthenticated }: { user: string, isAuthenticated: boolean}  = JSON.parse(sessionStorage!)
      setState({
        ...state,
        user,
        isAuthenticated,
        isLoading: false
      });
    }
    else
      setState({
        ...state,
        isLoading: false
      });
  }, []);
  return(
    <UserContext.Provider value={state}>
      {children}
    </UserContext.Provider>
  )

}
