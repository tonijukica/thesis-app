import { gql } from 'apollo-boost';

const REGISTER = gql`
mutation($username: String!){
  register(username: $username){
    status
    message
    credential{
      challenge
      rp{
        name
      }
      user{
        id
        name
        displayName
      }
      attestation
      pubKeyCredParams{
        type
        alg
      }
    }
  }
}
`;

const LOGIN = gql`
mutation($username: String!){
  login(username: $username){
    status
    message
    assertion{
      challenge
      allowCredentials{
        type
        id
        transports
      }
      userVerification
      rpId
      timeout
    }
  }
}
`;
const REGISTER_RESPONSE = gql`
mutation($input: ResponseInput!){
  registerResponse(input: $input){
    status
    message
  }
}
`;

const LOGIN_RESPONSE = gql`
mutation($input: ResponseInput!){
  loginResponse(input: $input){
    status
    message
  }
}
`;

const LOGOUT = gql`
mutation{
  logout{
    status
    message
  }
}
`;

const REGISTER_FAIL = gql`
mutation{
  registerFail{
    status
    message
  }
}
`;


export {
  REGISTER,
  LOGIN,
  REGISTER_RESPONSE,
  LOGIN_RESPONSE,
  REGISTER_FAIL,
  LOGOUT
}
