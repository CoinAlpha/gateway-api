import { Application } from 'express';
import fs from 'fs';
import https from 'https';

import { configManagerInstance } from './services/configuration_manager';
const globalConfig = configManagerInstance.readAllConfigs();

let certPath = globalConfig.CERT_PATH;

if (!certPath) {
  // assuming it is local development using test script to generate certs
  certPath = './certs';
} else {
  certPath = certPath.replace(/\/$/, '');
}

const certPassphrase = globalConfig.CERT_PASSPHRASE;

export default (app: Application) => {
  const serverKey = fs.readFileSync(certPath.concat('/server_key.pem'), {
    encoding: 'utf-8',
  });
  const serverCert = fs.readFileSync(certPath.concat('/server_cert.pem'), {
    encoding: 'utf-8',
  });
  const caCert = fs.readFileSync(certPath.concat('/ca_cert.pem'), {
    encoding: 'utf-8',
  });

  return https.createServer(
    {
      key: serverKey,
      cert: serverCert,
      // request client certificate from user
      requestCert: true,
      // reject requests with no valid certificate
      rejectUnauthorized: true,
      // use ca cert created with own key for self-signed
      ca: [caCert],
      passphrase: certPassphrase,
    },
    app
  );
};
