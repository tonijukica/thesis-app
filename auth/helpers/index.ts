import base64url from './base64urlArrayBuffer';

function publicKeyCredentialToJSON(pubKeyCred: any) {
  if (pubKeyCred instanceof Array) {
    const arr: any = [];
    for (const i of pubKeyCred) arr.push(publicKeyCredentialToJSON(i));

    return arr;
  } else if (pubKeyCred instanceof ArrayBuffer) {
    return base64url.encode(pubKeyCred);
  } else if (pubKeyCred instanceof Object) {
    const obj: any = {};

    for (const key in pubKeyCred)
      obj[key] = publicKeyCredentialToJSON(pubKeyCred[key]);

    return obj;
  }

  return pubKeyCred;
}

function generateRandomBuffer(len: number) {
  len = len || 32;

  const randomBuffer = new Uint8Array(len);
  window.crypto.getRandomValues(randomBuffer);

  return randomBuffer;
}

const formatCredReq = (credReq: any) => {
  credReq.challenge = base64url.decode(credReq.challenge);
  credReq.user.id = base64url.decode(credReq.user.id);
  return credReq;
};

const formatAssertReq = (assertReq: any) => {
  assertReq.challenge = base64url.decode(assertReq.challenge);

  for (const allowCred of assertReq.allowCredentials) {
    allowCred.id = base64url.decode(allowCred.id);
  }

  return assertReq;
};

export {
  publicKeyCredentialToJSON,
  generateRandomBuffer,
  formatCredReq,
  formatAssertReq,
};
