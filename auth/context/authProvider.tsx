import AuthContext from './authContext';
import UserProvider from './userProvider';
import { useMutation } from '@apollo/react-hooks';
import { REGISTER, LOGIN, RESPONSE } from '../../gql/queries/auth';
import { formatCredReq, formatAssertReq, publicKeyCredentialToJSON } from '../helpers';


export function AuthProvider({ children }: any,props: any): JSX.Element{
  const data = { user: null };
  const [registerRequest] = useMutation(REGISTER);
  const [loginRequest] = useMutation(LOGIN);
  const [serverReponse] = useMutation(RESPONSE);

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
      return serverReponse({
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
      const { status, message } = data.response;
      if(status === 'ok')
        localStorage.setItem('user', JSON.stringify({
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
      return navigator.credentials.create({publicKey});
    })
    .then(res => {
      const { id, rawId, response, type } = publicKeyCredentialToJSON(res);
      return serverReponse({
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
    .then(({data}) => {
      const { status, message } = data.response;
      if(status !== 'ok')
        throw new Error(message);
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
  };

  return(
    <AuthContext.Provider value={{
      data,
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


