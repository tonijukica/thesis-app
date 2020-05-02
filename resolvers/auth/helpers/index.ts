import base64url from 'base64url';
import { Credential } from '../../../types/credential';
import crypto from 'crypto';
import { Authenticator } from '../../../entities/Authenticator';
import { Assertion } from '../../../types/assertion';
import { allowCredentials } from '../../../types/allowCredentials';

function randomBase64urlBuffer(len: number){
  len = len || 32;
  const buffer = crypto.randomBytes(len);
  return base64url(buffer);
}

function generateCredential(id: number, username: string) {
  const credential: Credential = {
    challenge: randomBase64urlBuffer(32),
    rp: {
      name: 'Thesis App'
    },
    user: {
      id: base64url(Buffer.from(id.toString())),
      name: username,
      displayName: username
    },
    attestation: 'direct',
    pubKeyCredParams: [
      {
        type: 'public-key',
        alg: -7
      }
    ]
  };
  return credential;
}

function genereteAssertion(authenticators: Authenticator[]){
  const rpId = process.env.RP_ID || 'localhost';
  const allowCreds: allowCredentials[] = authenticators.map((authr: Authenticator) => {
    return {
      type: 'public-key',
			id: authr.credID,
			transports: ['usb', 'nfc', 'ble', 'internal']
    };
  });
  const assertion: Assertion = {
    challenge: randomBase64urlBuffer(32),
    allowCredentials: allowCreds,
    userVerification: 'discouraged',
    rpId,
    timeout: 60000
  };
  return assertion;
}

export {
  generateCredential,
  genereteAssertion
}
