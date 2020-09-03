import crypto from 'crypto';
import cbor from 'cbor';
import jsrsasign from 'jsrsasign';

function hash(alg: string, data: string | Buffer) {
  return crypto.createHash(alg).update(data).digest();
}

function parseAuthData(buffer: Buffer) {
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
  const aaguid = buffer.slice(0, 16);
  buffer = buffer.slice(16);

  const credIDLenBuf = buffer.slice(0, 2);
  buffer = buffer.slice(2);

  const credIDLen = credIDLenBuf.readUInt16BE(0);
  const credID = buffer.slice(0, credIDLen);
  buffer = buffer.slice(credIDLen);

  const COSEPublicKey = buffer;

  return {
    rpIdHash,
    flagsBuf,
    flags,
    counter,
    counterBuf,
    aaguid,
    credID,
    COSEPublicKey,
  };
}
async function verifySignature(
  signature: Buffer,
  data: Buffer,
  publicKey: string
) {
  return crypto
    .createVerify('SHA256')
    .update(data)
    .verify(publicKey, signature);
}

function COSEECDHAtoPKCS(COSEPublicKey: Buffer) {
  const coseStruct = cbor.decodeAllSync(COSEPublicKey)[0];
  const tag = Buffer.from([0x04]);
  const x = coseStruct.get(-2);
  const y = coseStruct.get(-3);

  return Buffer.concat([tag, x, y]);
}

function base64ToPem(base64cert: string) {
  let pemcert = '';
  for (let i = 0; i < base64cert.length; i += 64)
    pemcert += base64cert.slice(i, i + 64) + '\n';

  return (
    '-----BEGIN CERTIFICATE-----\n' + pemcert + '-----END CERTIFICATE-----'
  );
}

function getCertificationInfo(certificate: any) {
  const subjectCert = new jsrsasign.X509();
  subjectCert.readCertPEM(certificate);

  const subjectString = subjectCert.getSubjectString();
  const subjectParts = subjectString.slice(1).split('/');

  const subject: any = {};
  for (const field of subjectParts) {
    const kv = field.split('=');
    subject[kv[0]] = kv[1];
  }

  const version = subjectCert.getVersion();
  // const basicConstraintsCA = !!subjectCert.getExtBasicConstraints().cA;
  const basicConstraintsCA = false;

  return {
    subject,
    version,
    basicConstraintsCA,
  };
}

export {
  hash,
  parseAuthData,
  verifySignature,
  COSEECDHAtoPKCS,
  base64ToPem,
  getCertificationInfo,
};
