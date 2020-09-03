import base64url from 'base64url';
import { AuthChecker } from 'type-graphql';
import crypto from 'crypto';
import cbor from 'cbor';
import { Authenticator } from '../../../entities/Authenticator';
import { Assertion } from '../../../types/assertion';
import { allowCredentials } from '../../../types/allowCredentials';
import { Response } from '../../../types/response';
import verifyPackedAttestation from './verifyPackedAttestation';
import noneFormat from './noneFormat';
import { hash, verifySignature } from './common';
import { Credential } from '../../../types/credential';
import { IContext } from '../../../types/IContext';

function randomBase64urlBuffer(len: number) {
  len = len || 32;
  const buffer = crypto.randomBytes(len);
  return base64url(buffer);
}

function generateCredential(id: number, username: string) {
  const credential: Credential = {
    challenge: randomBase64urlBuffer(32),
    rp: {
      name: 'Thesis App',
    },
    user: {
      id: base64url(Buffer.from(id.toString())),
      name: username,
      displayName: username,
    },
    attestation: 'direct',
    pubKeyCredParams: [
      {
        type: 'public-key',
        alg: -7,
      },
      {
        type: 'public-key',
        alg: -35,
      },
      {
        type: 'public-key',
        alg: -36,
      },
      {
        type: 'public-key',
        alg: -257,
      },
      {
        type: 'public-key',
        alg: -258,
      },
      {
        type: 'public-key',
        alg: -259,
      },
      {
        type: 'public-key',
        alg: -38,
      },
      {
        type: 'public-key',
        alg: -39,
      },
      {
        type: 'public-key',
        alg: -8,
      },
    ],
  };
  return credential;
}

function genereteAssertion(authenticators: Authenticator[]) {
  const rpId = process.env.RP_ID || 'localhost';
  const allowCreds: allowCredentials[] = authenticators.map(
    (authr: Authenticator) => {
      return {
        type: 'public-key',
        id: authr.credID,
        transports: ['usb', 'nfc', 'ble', 'internal'],
      };
    }
  );
  const assertion: Assertion = {
    challenge: randomBase64urlBuffer(32),
    allowCredentials: allowCreds,
    userVerification: 'discouraged',
    rpId,
    timeout: 60000,
  };
  return assertion;
}

async function verifyAttestationResponse(webauthnResponse: Response) {
  const attestationBuffer = base64url.toBuffer(
    webauthnResponse.attestationObject!
  );
  const attestationStruct = cbor.decodeAllSync(attestationBuffer)[0];
  const { clientDataJSON } = webauthnResponse;
  let verification: any;

  if (attestationStruct.fmt === 'packed')
    verification = await verifyPackedAttestation(
      attestationStruct,
      clientDataJSON!
    );
  else if (attestationStruct.fmt === 'none')
    verification = await noneFormat(attestationStruct);
  else {
    verification!.verified = false;
  }

  if (verification!.verified) {
    const response = {
      verified: verification!.verified,
      authrInfo: verification!.authrInfo,
    };
    return response;
  } else
    return {
      verified: false,
    };
}

function findAuthenticator(credID: string, authenticators: Authenticator[]) {
  for (const authr of authenticators) {
    if (authr.credID === credID) return authr;
  }
  throw new Error(`Unknown authenticator with credID ${credID}!`);
}

function parseAssertAuthenticatorData(buffer: Buffer) {
  const rpIdHash = buffer.slice(0, 32);
  buffer = buffer.slice(32);

  const flagsBuf = buffer.slice(0, 1);
  buffer = buffer.slice(1);

  const flagsInt = flagsBuf[0];
  const flags = {
    up: !!(flagsInt & 0x01),
    uv: !!(flagsInt & 0x04),
    at: !!(flagsInt & 0x40),
    ed: !!(flagsInt & 0x80),
    flagsInt,
  };

  const counterBuf = buffer.slice(0, 4);
  buffer = buffer.slice(4);

  const counter = counterBuf.readUInt32BE(0);

  return { rpIdHash, flagsBuf, flags, counter, counterBuf };
}

function ASN1toPEM(pkBuffer: Buffer) {
  if (!Buffer.isBuffer(pkBuffer))
    throw new Error('ASN1toPEM: input must be a Buffer');
  let type;
  if (pkBuffer.length === 65 && pkBuffer[0] === 0x04) {
    const prefix: Buffer = Buffer.from(
      '3059301306072a8648ce3d020106082a8648ce3d030107034200',
      'hex'
    );
    pkBuffer = Buffer.concat([prefix, pkBuffer]);
    type = 'PUBLIC KEY';
  } else type = 'CERTIFICATE';
  const base64Certificate = pkBuffer.toString('base64');
  let PEMKey = '';

  for (let i = 0; i < Math.ceil(base64Certificate.length / 64); i++) {
    const start = 64 * i;
    PEMKey += base64Certificate.substr(start, 64) + '\n';
  }

  PEMKey = `-----BEGIN ${type}-----\n` + PEMKey + `-----END ${type}-----\n`;

  return PEMKey;
}

function checkPEM(pubKey: any) {
  return pubKey.toString('base64').includes('BEGIN');
}

async function verifyAssertionResponse(
  webauthnResponse: Response,
  id: string,
  authenticators: Authenticator[]
) {
  const authr = findAuthenticator(id, authenticators);
  const authenticatorData = base64url.toBuffer(
    webauthnResponse.authenticatorData!
  );
  const response: any = { verified: false };

  if (authr.fmt === 'packed' || authr.fmt === 'none') {
    const authenticatorDataStruct = parseAssertAuthenticatorData(
      authenticatorData
    );

    if (!authenticatorDataStruct.flags.up)
      throw new Error('User was NOT presented durring authentication!');

    const clientDataHash = hash(
      'sha256',
      base64url.toBuffer(webauthnResponse.clientDataJSON!)
    );
    const signatureBase = Buffer.concat([
      authenticatorDataStruct.rpIdHash,
      authenticatorDataStruct.flagsBuf,
      authenticatorDataStruct.counterBuf,
      clientDataHash,
    ]);

    const publicKey: string = checkPEM(authr.publicKey)
      ? authr.publicKey
      : ASN1toPEM(base64url.toBuffer(authr.publicKey));

    const signature = base64url.toBuffer(webauthnResponse.signature!);

    const verify = await verifySignature(signature, signatureBase, publicKey);

    if (verify) {
      response.verified = verify;
      if (response.counter <= authr.counter)
        throw new Error('Authr counter did not increase!');
      authr.counter = authenticatorDataStruct.counter;
      authr.save();
    }
    return response;
  }
}

const authChecker: AuthChecker<IContext> = ({ context }) => {
  if (context.req.session!.authenticated) return true;
  else return false;
};

export {
  authChecker,
  generateCredential,
  genereteAssertion,
  verifyAttestationResponse,
  verifyAssertionResponse,
};
