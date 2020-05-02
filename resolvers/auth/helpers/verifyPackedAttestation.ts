import base64url from 'base64url';
import { hash, parseAuthData, verifySignature, COSEECDHAtoPKCS, base64ToPem, getCertificationInfo } from './common';

async function verifyPackedAttestation(ctapCredentialResponse: any, clientDataJSON: string){
	const authenticatorDataStruct = parseAuthData(ctapCredentialResponse.authData);
	const clientDataHash = hash('SHA256',base64url.decode(clientDataJSON));
	const signatureBase = Buffer.concat([
		ctapCredentialResponse.authData,
		clientDataHash
	]);

	const signature = ctapCredentialResponse.attStmt.sig;

	if(ctapCredentialResponse.attStmt.x5c){
		const leafCert = base64ToPem(ctapCredentialResponse.attStmt.x5c[0].toString('base64'));
		const certInfo = getCertificationInfo(leafCert);

		if(certInfo.subject.OU !== 'Authenticator Attestation')
			throw new Error('Batch certificate OU MUST be set strictly to "Authenticator Attestation"!');

		if(!certInfo.subject.CN)
			throw new Error('Batch certificate CN MUST no be empty!');

		if(!certInfo.subject.O)
			throw new Error('Batch certificate CN MUST no be empty!');

		if(!certInfo.subject.C || certInfo.subject.C.length !== 2)
			throw new Error('Batch certificate C MUST be set to two character ISO 3166 code!');

		if(certInfo.basicConstraintsCA)
			throw new Error('Batch certificate basic constraints CA MUST be false!');

		if(certInfo.version !== 3)
			throw new Error('Batch certificate version MUST be 3(ASN1 2)!');

		const verified = await verifySignature(signature, signatureBase, leafCert);
		const publicKey = COSEECDHAtoPKCS(authenticatorDataStruct.COSEPublicKey);

		return {
			verified,
			authrInfo: {
				fmt: 'packed',
				publicKey:  base64url(publicKey),
				counter: authenticatorDataStruct.counter,
				credID: base64url(authenticatorDataStruct.credID)
			}
		};
	}
	else if(ctapCredentialResponse.attStmt.ecdaaKeyId)
		throw new Error('ECDAA not implemented yet');

	else{
    throw new Error('Self surrogate not implemented yet');
	}
}

export default verifyPackedAttestation;
