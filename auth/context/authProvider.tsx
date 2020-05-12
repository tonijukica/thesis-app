import AuthContext from './authContext';
import UserProvider from './userProvider';
import { useMutation } from '@apollo/react-hooks';
import { REGISTER, LOGIN, REGISTER_RESPONSE, LOGIN_RESPONSE, LOGOUT, REGISTER_FAIL } from '../../gql/queries/auth';
import { formatCredReq, formatAssertReq, publicKeyCredentialToJSON } from '../helpers';


export function AuthProvider({ children }: any,props: any): JSX.Element{
  const [registerRequest] = useMutation(REGISTER);
  const [loginRequest] = useMutation(LOGIN);
  const [registerResponse] = useMutation(REGISTER_RESPONSE);
  const [loginResponse] = useMutation(LOGIN_RESPONSE);
  const [logoutRequest] = useMutation(LOGOUT);
  const [registerFail] = useMutation(REGISTER_FAIL);

  const login = (username: string) => {
    return loginRequest({
      variables: {
        username
      }
    }).then(({data}) => {
      const { status, message, assertion } = data.login;
      if(status !== 'ok')
        throw new Error(message);
      const publicKey = formatAssertReq(assertion);
      return navigator.credentials.get({publicKey});
    })
    .then(res => {
      const {id, rawId, response, type } = publicKeyCredentialToJSON(res);
      return loginResponse({
        variables: {
          input: {
            id,
            rawId,
            response: {
              authenticatorData: response.authenticatorData,
              clientDataJSON: response.clientDataJSON,
              signature: response.signature
            },
            type
          }
        }
      });
    })
    .then(({data}) => {
      const { status, message } = data.loginResponse;
      if(status === 'ok')
        sessionStorage.setItem('user', JSON.stringify({
          user: username,
          isAuthenticated: true
        }));
      else
        throw new Error(message)
    });
  };

  const register = (username: string) => {
    return registerRequest({
      variables: {
        username
      }
    })
    .then(({data}) => {
      const { status, message, credential } = data.register;
      if(status !== 'ok')
        throw new Error(message);
      const publicKey = formatCredReq(credential);
      return navigator.credentials.create({publicKey})
        .catch(() => {
          registerFail();
          throw new Error('Registration failed');
        });
    })
    .then(res => {
      const { id, rawId, response, type } = publicKeyCredentialToJSON(res);
      return registerResponse({
        variables: {
          input: {
            id,
            rawId,
            response: {
              attestationObject: response.attestationObject,
              clientDataJSON: response.clientDataJSON
            },
            type
          }
        }
      });
    })
    .then(async ({data}) => {
      const { status, message } = data.registerResponse;
      if(status !== 'ok'){
        await registerFail();
        throw new Error(message);
      }
    });
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    return logoutRequest();
  };

  return(
    <AuthContext.Provider value={{
     login,
     register,
     logout
     }} {...props}>
      <UserProvider>
        {children}
      </UserProvider>
    </AuthContext.Provider>
  );
}


