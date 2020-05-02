import base64url from './base64urlArrayBuffer';

function generateRandomBuffer(len: number) {
	len = len || 32;

	const randomBuffer = new Uint8Array(len);
	window.crypto.getRandomValues(randomBuffer);

	return randomBuffer;
}

const  formatCredReq = (credReq: any) => {
  console.log(credReq);
	credReq.challenge = base64url.decode(credReq.challenge);
	credReq.user.id = base64url.decode(credReq.user.id);
  console.log(credReq);
	return credReq;
};

const formatAssertReq = (assertReq: any) => {
  console.log(assertReq);
	assertReq.challenge = base64url.decode(assertReq.challenge);

	for(let allowCred of assertReq.allowCredentials) {
		allowCred.id = base64url.decode(allowCred.id);
	}
  console.log(assertReq);
	return assertReq;
};

export { generateRandomBuffer, formatCredReq, formatAssertReq };
