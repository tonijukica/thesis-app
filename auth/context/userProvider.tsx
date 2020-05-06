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
    const localeStorage = window.localStorage.getItem('user');
    if(localeStorage){
      const { user, isAuthenticated }: { user: string, isAuthenticated: boolean}  = JSON.parse(localeStorage!)
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
