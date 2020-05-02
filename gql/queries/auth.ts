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

export {
  REGISTER,
  LOGIN
}
